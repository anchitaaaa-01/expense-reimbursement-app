import { db } from '@/db';
import { users } from '@/db/schema';

async function main() {
    const sampleUsers = [
        {
            email: 'employee@company.com',
            name: 'John Doe',
            role: 'employee',
            department: 'Engineering',
            createdAt: new Date('2024-01-15').toISOString(),
        },
        {
            email: 'manager@company.com',
            name: 'Jane Smith',
            role: 'manager',
            department: 'Engineering',
            createdAt: new Date('2024-01-20').toISOString(),
        },
        {
            email: 'admin@company.com',
            name: 'Bob Johnson',
            role: 'admin',
            department: 'Operations',
            createdAt: new Date('2024-02-01').toISOString(),
        }
    ];

    await db.insert(users).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});