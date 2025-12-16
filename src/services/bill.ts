import { prisma } from "@/lib/db";
import { BillStatus } from "@prisma/client";

export async function createNewBill(data: {
    organizationId: string;
    memberId: string;
    period: string;
    amount: number;
}) {
    return await prisma.bill.create({
        data: {
            organizationId: data.organizationId,
            memberId: data.memberId,
            period: data.period,
            amount: data.amount,
            status: "UNPAID",
        },
    });
}

export async function updateExistingBillStatus(id: string, status: BillStatus) {
    return await prisma.bill.update({
        where: { id },
        data: { status },
        include: { member: true },
    });
}

export async function getBillList(organizationId: string, page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    const whereClause: any = { organizationId };

    if (search) {
        whereClause.member = {
            name: { contains: search, mode: 'insensitive' }
        };
    }

    const [data, total] = await Promise.all([
        prisma.bill.findMany({
            where: whereClause,
            include: { member: true },
            orderBy: { period: 'desc' },
            take: limit,
            skip
        }),
        prisma.bill.count({ where: whereClause })
    ]);

    return {
        data,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}

export async function generateMonthlyBillsService(
    organizationId: string,
    period: string,
    amount: number
) {
    // 1. Get all members of the organization
    const members = await prisma.member.findMany({
        where: { organizationId },
    });

    let count = 0;

    // 2. Loop through members and create bill if not exists
    for (const member of members) {
        const existingBill = await prisma.bill.findFirst({
            where: {
                organizationId,
                memberId: member.id,
                period,
            },
        });

        if (!existingBill) {
            await prisma.bill.create({
                data: {
                    organizationId,
                    memberId: member.id,
                    period,
                    amount,
                    status: "UNPAID",
                },
            });
            count++;
        }
    }
    return { count };
}
