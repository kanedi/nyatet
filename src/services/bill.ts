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
    });
}

export async function getBillList(organizationId: string) {
    return await prisma.bill.findMany({
        where: { organizationId },
        include: { member: true },
        orderBy: { period: 'desc' }
    });
}
