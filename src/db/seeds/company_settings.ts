import { db } from '@/db';
import { companySettings } from '@/db/schema';

async function main() {
    const sampleSettings = [
        {
            key: 'default_currency',
            value: 'USD',
            createdAt: new Date('2024-01-01').toISOString(),
        },
        {
            key: 'expense_categories',
            value: JSON.stringify(['Travel', 'Meals', 'Office Supplies', 'Software', 'Other']),
            createdAt: new Date('2024-01-01').toISOString(),
        },
        {
            key: 'max_receipt_size_mb',
            value: '10',
            createdAt: new Date('2024-01-01').toISOString(),
        },
        {
            key: 'require_receipt_over_amount',
            value: '25',
            createdAt: new Date('2024-01-01').toISOString(),
        }
    ];

    await db.insert(companySettings).values(sampleSettings);
    
    console.log('✅ Company settings seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});