import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');
    
    // Validate limit parameter
    let limit = 10; // default
    if (limitParam) {
      const parsedLimit = parseInt(limitParam);
      if (isNaN(parsedLimit) || parsedLimit < 1) {
        return NextResponse.json({ 
          error: "Limit must be a positive integer",
          code: "INVALID_LIMIT" 
        }, { status: 400 });
      }
      limit = Math.min(parsedLimit, 100); // max limit 100
    }
    
    // Validate offset parameter
    let offset = 0; // default
    if (offsetParam) {
      const parsedOffset = parseInt(offsetParam);
      if (isNaN(parsedOffset) || parsedOffset < 0) {
        return NextResponse.json({ 
          error: "Offset must be a non-negative integer",
          code: "INVALID_OFFSET" 
        }, { status: 400 });
      }
      offset = parsedOffset;
    }
    
    // Filter and search parameters
    const search = searchParams.get('search');
    const role = searchParams.get('role');
    const department = searchParams.get('department');
    
    // Build query with filters
    let query = db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      department: users.department,
      createdAt: users.createdAt
    }).from(users);
    
    // Build where conditions
    const conditions = [];
    
    // Role filter
    if (role) {
      conditions.push(eq(users.role, role));
    }
    
    // Department filter
    if (department) {
      conditions.push(eq(users.department, department));
    }
    
    // Search filter (name and email)
    if (search) {
      conditions.push(
        or(
          like(users.name, `%${search}%`),
          like(users.email, `%${search}%`)
        )
      );
    }
    
    // Apply where conditions
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }
    
    // Apply ordering, pagination and execute
    const results = await query
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);
    
    return NextResponse.json(results, { status: 200 });
    
  } catch (error) {
    console.error('GET users error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}