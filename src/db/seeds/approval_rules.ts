import { db } from '@/db';
import { approvalRules } from '@/db/schema';

async function main() {
    const sampleApprovalRules = [
        {
            minAmount: 0,
            maxAmount: 99.99,
            requiredApprovers: 0,
            autoApprove: true,
            createdAt: new Date('2024-01-01').toISOString(),
        },
        {
            minAmount: 100,
            maxAmount: 1000,
            requiredApprovers: 1,
            autoApprove: false,
            createdAt: new Date('2024-01-01').toISOString(),
        },
        {
            minAmount: 1000,
            maxAmount: null,
            requiredApprovers: 2,
            autoApprove: false,
            createdAt: new Date('2024-01-01').toISOString(),
        }
    ];

    await db.insert(approvalRules).values(sampleApprovalRules);
    
    console.log('✅ Approval rules seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});