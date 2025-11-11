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

    if (isNaN(parseInt(approverId))) {
      return NextResponse.json({
        error: "Valid approver ID is required",
        code: "INVALID_APPROVER_ID"
      }, { status: 400 });
    }

    const parsedApproverId = parseInt(approverId);

    // Check if expense exists and is in pending status
    const expense = await db.select()
      .from(expenses)
      .where(eq(expenses.id, expenseId))
      .limit(1);

    if (expense.length === 0) {
      return NextResponse.json({
        error: "Expense not found",
        code: "EXPENSE_NOT_FOUND"
      }, { status: 404 });
    }

    const expenseRecord = expense[0];

    // Validate expense status
    if (expenseRecord.status !== 'pending') {
      return NextResponse.json({
        error: "Only pending expenses can be approved",
        code: "INVALID_EXPENSE_STATUS"
      }, { status: 400 });
    }

    // Validate approver exists
    const approver = await db.select()
      .from(users)
      .where(eq(users.id, parsedApproverId))
      .limit(1);

    if (approver.length === 0) {
      return NextResponse.json({
        error: "Approver not found",
        code: "APPROVER_NOT_FOUND"
      }, { status: 404 });
    }

    // Perform atomic transaction: create approval record and update expense
    const now = new Date().toISOString();

    // Create approval record
    const newApproval = await db.insert(approvals)
      .values({
        expenseId: expenseId,
        approverId: parsedApproverId,
        status: 'approved',
        comments: comments || null,
        approvedAt: now,
        createdAt: now
      })
      .returning();

    // Update expense status
    const updatedExpense = await db.update(expenses)
      .set({
        status: 'approved',
        updatedAt: now
      })
      .where(eq(expenses.id, expenseId))
      .returning();

    if (updatedExpense.length === 0) {
      return NextResponse.json({
        error: "Failed to update expense status",
        code: "UPDATE_FAILED"
      }, { status: 500 });
    }

    // Return updated expense with approval details
    const responseData = {
      ...updatedExpense[0],
      approval: {
        id: newApproval[0].id,
        approverId: newApproval[0].approverId,
        approverName: approver[0].name,
        approverEmail: approver[0].email,
        status: newApproval[0].status,
        comments: newApproval[0].comments,
        approvedAt: newApproval[0].approvedAt,
        createdAt: newApproval[0].createdAt
      }
    };

    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error('POST /api/expenses/[id]/approve error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error,
      code: "INTERNAL_ERROR"
    }, { status: 500 });
  }
}