import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { expenses, users } from '@/db/schema';
import { eq, like, and, or, desc, asc, gte, lte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const currency = searchParams.get('currency');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    let query = db.select({
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
        role: users.role,
        department: users.department
      }
    }).from(expenses).leftJoin(users, eq(expenses.userId, users.id));

    // Build where conditions
    const conditions = [];

    if (search) {
      conditions.push(or(
        like(expenses.title, `%${search}%`),
        like(expenses.description, `%${search}%`)
      ));
    }

    if (userId) {
      conditions.push(eq(expenses.userId, parseInt(userId)));
    }

    if (status) {
      conditions.push(eq(expenses.status, status));
    }

    if (category) {
      conditions.push(eq(expenses.category, category));
    }

    if (currency) {
      conditions.push(eq(expenses.currency, currency));
    }

    if (startDate) {
      conditions.push(gte(expenses.createdAt, startDate));
    }

    if (endDate) {
      conditions.push(lte(expenses.createdAt, endDate));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const orderBy = order === 'asc' ? asc : desc;
    if (sort === 'title') {
      query = query.orderBy(orderBy(expenses.title));
    } else if (sort === 'amount') {
      query = query.orderBy(orderBy(expenses.amount));
    } else if (sort === 'status') {
      query = query.orderBy(orderBy(expenses.status));
    } else {
      query = query.orderBy(orderBy(expenses.createdAt));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error,
      code: 'INTERNAL_ERROR' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { userId, title, amount, category, currency, description, receiptUrl } = requestBody;

    // Validate required fields
    if (!userId) {
      return NextResponse.json({ 
        error: "User ID is required",
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    if (!title || title.trim() === '') {
      return NextResponse.json({ 
        error: "Title is required",
        code: "MISSING_TITLE" 
      }, { status: 400 });
    }

    if (!amount || amount <= 0) {
      return NextResponse.json({ 
        error: "Amount must be a positive number",
        code: "INVALID_AMOUNT" 
      }, { status: 400 });
    }

    if (!category || category.trim() === '') {
      return NextResponse.json({ 
        error: "Category is required",
        code: "MISSING_CATEGORY" 
      }, { status: 400 });
    }

    // Validate userId exists in users table
    const userExists = await db.select()
      .from(users)
      .where(eq(users.id, parseInt(userId)))
      .limit(1);

    if (userExists.length === 0) {
      return NextResponse.json({ 
        error: "User not found",
        code: "USER_NOT_FOUND" 
      }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedTitle = title.trim();
    const sanitizedCategory = category.trim();
    const sanitizedDescription = description ? description.trim() : null;
    const sanitizedReceiptUrl = receiptUrl ? receiptUrl.trim() : null;
    const sanitizedCurrency = currency ? currency.trim().toUpperCase() : 'USD';

    // Create expense
    const newExpense = await db.insert(expenses).values({
      userId: parseInt(userId),
      title: sanitizedTitle,
      amount: parseFloat(amount),
      currency: sanitizedCurrency,
      category: sanitizedCategory,
      description: sanitizedDescription,
      receiptUrl: sanitizedReceiptUrl,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }).returning();

    // Get the created expense with user details
    const createdExpense = await db.select({
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
        role: users.role,
        department: users.department
      }
    }).from(expenses)
      .leftJoin(users, eq(expenses.userId, users.id))
      .where(eq(expenses.id, newExpense[0].id))
      .limit(1);

    return NextResponse.json(createdExpense[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error,
      code: 'INTERNAL_ERROR' 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const requestBody = await request.json();
    const { title, amount, category, currency, description, receiptUrl, status } = requestBody;

    // Check if record exists
    const existingRecord = await db.select()
      .from(expenses)
      .where(eq(expenses.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ 
        error: 'Expense not found',
        code: 'EXPENSE_NOT_FOUND' 
      }, { status: 404 });
    }

    // Validate amount if provided
    if (amount !== undefined && amount <= 0) {
      return NextResponse.json({ 
        error: "Amount must be a positive number",
        code: "INVALID_AMOUNT" 
      }, { status: 400 });
    }

    // Build update object with only provided fields
    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    if (title !== undefined) updates.title = title.trim();
    if (amount !== undefined) updates.amount = parseFloat(amount);
    if (category !== undefined) updates.category = category.trim();
    if (currency !== undefined) updates.currency = currency.trim().toUpperCase();
    if (description !== undefined) updates.description = description ? description.trim() : null;
    if (receiptUrl !== undefined) updates.receiptUrl = receiptUrl ? receiptUrl.trim() : null;
    if (status !== undefined) updates.status = status;

    const updated = await db.update(expenses)
      .set(updates)
      .where(eq(expenses.id, parseInt(id)))
      .returning();

    // Get the updated expense with user details
    const updatedExpense = await db.select({
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
        role: users.role,
        department: users.department
      }
    }).from(expenses)
      .leftJoin(users, eq(expenses.userId, users.id))
      .where(eq(expenses.id, parseInt(id)))
      .limit(1);

    return NextResponse.json(updatedExpense[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error,
      code: 'INTERNAL_ERROR' 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if record exists
    const existingRecord = await db.select()
      .from(expenses)
      .where(eq(expenses.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ 
        error: 'Expense not found',
        code: 'EXPENSE_NOT_FOUND' 
      }, { status: 404 });
    }

    const deleted = await db.delete(expenses)
      .where(eq(expenses.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Expense deleted successfully',
      deletedExpense: deleted[0] 
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error,
      code: 'INTERNAL_ERROR' 
    }, { status: 500 });
  }
}