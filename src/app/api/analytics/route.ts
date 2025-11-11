import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { expenses, users } from '@/db/schema';
import { eq, and, gte, lte, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const userId = searchParams.get('userId');

    // Validate date range
    if (startDate && isNaN(Date.parse(startDate))) {
      return NextResponse.json({ 
        error: 'Invalid start date format',
        code: 'INVALID_START_DATE' 
      }, { status: 400 });
    }

    if (endDate && isNaN(Date.parse(endDate))) {
      return NextResponse.json({ 
        error: 'Invalid end date format',
        code: 'INVALID_END_DATE' 
      }, { status: 400 });
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return NextResponse.json({ 
        error: 'Start date must be before end date',
        code: 'INVALID_DATE_RANGE' 
      }, { status: 400 });
    }

    // Build date filter conditions
    const dateConditions = [];
    if (startDate) {
      dateConditions.push(gte(expenses.createdAt, startDate));
    }
    if (endDate) {
      dateConditions.push(lte(expenses.createdAt, endDate));
    }

    // Build base conditions
    const baseConditions = [];
    if (userId) {
      baseConditions.push(eq(expenses.userId, parseInt(userId)));
    }

    const whereCondition = [...baseConditions, ...dateConditions].length > 0 
      ? and(...baseConditions, ...dateConditions)
      : undefined;

    // Get all expenses within date range
    const allExpenses = whereCondition 
      ? await db.select().from(expenses).where(whereCondition)
      : await db.select().from(expenses);

    // Filter approved expenses for financial calculations
    const approvedExpenses = allExpenses.filter(expense => expense.status === 'approved');

    // Calculate total spent (only approved expenses)
    const totalSpent = approvedExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate average amount (only approved expenses)
    const averageAmount = approvedExpenses.length > 0 
      ? totalSpent / approvedExpenses.length 
      : 0;

    // Group by category (only approved expenses for amounts)
    const categoryMap = new Map();
    approvedExpenses.forEach(expense => {
      const existing = categoryMap.get(expense.category) || { category: expense.category, amount: 0, count: 0 };
      existing.amount += expense.amount;
      existing.count += 1;
      categoryMap.set(expense.category, existing);
    });
    const byCategory = Array.from(categoryMap.values());

    // Group by status (all expenses for status analytics)
    const statusMap = new Map();
    allExpenses.forEach(expense => {
      const existing = statusMap.get(expense.status) || { status: expense.status, amount: 0, count: 0 };
      existing.amount += expense.amount;
      existing.count += 1;
      statusMap.set(expense.status, existing);
    });
    const byStatus = Array.from(statusMap.values());

    // Group by currency (only approved expenses)
    const currencyMap = new Map();
    approvedExpenses.forEach(expense => {
      const existing = currencyMap.get(expense.currency) || { currency: expense.currency, amount: 0 };
      existing.amount += expense.amount;
      currencyMap.set(expense.currency, existing);
    });
    const byCurrency = Array.from(currencyMap.values());

    // Monthly trends (only approved expenses)
    const monthlyMap = new Map();
    approvedExpenses.forEach(expense => {
      const date = new Date(expense.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const existing = monthlyMap.get(monthKey) || { month: monthKey, amount: 0 };
      existing.amount += expense.amount;
      monthlyMap.set(monthKey, existing);
    });
    
    // Sort monthly trends by month
    const monthlyTrends = Array.from(monthlyMap.values())
      .sort((a, b) => a.month.localeCompare(b.month));

    const analytics = {
      totalSpent: Math.round(totalSpent * 100) / 100,
      byCategory: byCategory.map(item => ({
        ...item,
        amount: Math.round(item.amount * 100) / 100
      })),
      byStatus: byStatus.map(item => ({
        ...item,
        amount: Math.round(item.amount * 100) / 100
      })),
      byCurrency: byCurrency.map(item => ({
        ...item,
        amount: Math.round(item.amount * 100) / 100
      })),
      monthlyTrends: monthlyTrends.map(item => ({
        ...item,
        amount: Math.round(item.amount * 100) / 100
      })),
      averageAmount: Math.round(averageAmount * 100) / 100
    };

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('GET analytics error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}