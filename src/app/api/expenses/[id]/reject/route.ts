import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { expenses, approvals, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid expense ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const expenseId = parseInt(id);

    // Parse request body
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (error) {
      return NextResponse.json({ 
        error: "Invalid JSON in request body",
        code: "INVALID_JSON" 
      }, { status: 400 });
    }

    const { approverId, comments } = requestBody;

    // Validate required fields
    if (!approverId) {
      return NextResponse.json({ 
        error: "Approver ID is required",
        code: "MISSING_APPROVER_ID" 
      }, { status: 400 });
    }

    if (!comments || typeof comments !== 'string' || comments.trim().length === 0) {
      return NextResponse.json({ 
        error: "Comments are required for rejections",
        code: "MISSING_COMMENTS" 
      }, { status: 400 });
    }

    // Validate approver ID is a valid integer
    if (isNaN(parseInt(approverId))) {
      return NextResponse.json({ 
        error: "Valid approver ID is required",
        code: "INVALID_APPROVER_ID" 
      }, { status: 400 });
    }

    const approverIdInt = parseInt(approverId);

    // Check if expense exists
    const expense = await db.select()
      .from(expenses)
      .where(eq(expenses.id, expenseId))
      .limit(1);

    if (expense.length === 0) {
      return NextResponse.json({ 
        error: 'Expense not found',
        code: 'EXPENSE_NOT_FOUND' 
      }, { status: 404 });
    }

    // Check if expense is in pending status
    if (expense[0].status !== 'pending') {
      return NextResponse.json({ 
        error: 'Only pending expenses can be rejected',
        code: 'INVALID_EXPENSE_STATUS' 
      }, { status: 400 });
    }

    // Validate approver exists
    const approver = await db.select()
      .from(users)
      .where(eq(users.id, approverIdInt))
      .limit(1);

    if (approver.length === 0) {
      return NextResponse.json({ 
        error: 'Approver not found',
        code: 'APPROVER_NOT_FOUND' 
      }, { status: 400 });
    }

    const currentTimestamp = new Date().toISOString();

    // Create approval record with rejected status
    const newApproval = await db.insert(approvals)
      .values({
        expenseId: expenseId,
        approverId: approverIdInt,
        status: 'rejected',
        comments: comments.trim(),
        approvedAt: currentTimestamp,
        createdAt: currentTimestamp,
      })
      .returning();

    // Update expense status to rejected
    const updatedExpense = await db.update(expenses)
      .set({
        status: 'rejected',
        updatedAt: currentTimestamp
      })
      .where(eq(expenses.id, expenseId))
      .returning();

    // Get the complete updated expense with rejection details
    const expenseWithDetails = {
      ...updatedExpense[0],
      rejection: {
        approver: {
          id: approver[0].id,
          name: approver[0].name,
          email: approver[0].email
        },
        comments: newApproval[0].comments,
        rejectedAt: newApproval[0].approvedAt,
        approvalId: newApproval[0].id
      }
    };

    return NextResponse.json(expenseWithDetails, { status: 200 });

  } catch (error) {
    console.error('POST /api/expenses/[id]/reject error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}