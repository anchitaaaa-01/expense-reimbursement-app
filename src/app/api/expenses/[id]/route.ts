import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { expenses, users, approvals } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Validate ID is valid integer
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Get expense with user details
    const expenseResult = await db.select({
      id: expenses.id,
      userId: expenses.userId,
      title: expenses.title,
      amount: expenses.amount,
      currency: expenses.currency,
      category: expenses.category,
      description: expenses.description,
      receiptUrl: expenses.receiptUrl,
      status: expenses.status,
      submittedAt: expenses.submittedAt,
      createdAt: expenses.createdAt,
      updatedAt: expenses.updatedAt,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        department: users.department
      }
    })
    .from(expenses)
    .innerJoin(users, eq(expenses.userId, users.id))
    .where(eq(expenses.id, parseInt(id)))
    .limit(1);

    if (expenseResult.length === 0) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    const expense = expenseResult[0];

    // Get approval history
    const approvalHistory = await db.select({
      id: approvals.id,
      status: approvals.status,
      comments: approvals.comments,
      approvedAt: approvals.approvedAt,
      createdAt: approvals.createdAt,
      approver: {
        id: users.id,
        name: users.name,
        email: users.email,
        department: users.department
      }
    })
    .from(approvals)
    .innerJoin(users, eq(approvals.approverId, users.id))
    .where(eq(approvals.expenseId, parseInt(id)));

    // Combine expense with approval history
    const result = {
      ...expense,
      approvalHistory
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('GET expense error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Validate ID is valid integer
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if expense exists
    const existingExpense = await db.select()
      .from(expenses)
      .where(eq(expenses.id, parseInt(id)))
      .limit(1);

    if (existingExpense.length === 0) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    const requestBody = await request.json();
    const { title, amount, currency, category, description, receiptUrl, status } = requestBody;

    // Validate amount is positive if provided
    if (amount !== undefined && amount <= 0) {
      return NextResponse.json({ 
        error: "Amount must be positive",
        code: "INVALID_AMOUNT" 
      }, { status: 400 });
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date().toISOString()
    };

    if (title !== undefined) updateData.title = title;
    if (amount !== undefined) updateData.amount = amount;
    if (currency !== undefined) updateData.currency = currency;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (receiptUrl !== undefined) updateData.receiptUrl = receiptUrl;
    if (status !== undefined) {
      updateData.status = status;
      // If status changes to 'pending', set submittedAt timestamp
      if (status === 'pending') {
        updateData.submittedAt = new Date().toISOString();
      }
    }

    // Update expense
    const updated = await db.update(expenses)
      .set(updateData)
      .where(eq(expenses.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
    }

    return NextResponse.json(updated[0]);

  } catch (error) {
    console.error('PATCH expense error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}