"use server";

import { PrismaClient, BillStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createBill(data: {
    organizationId: string;
    memberId: string;
    period: string; // e.g. "Januari 2024"
    amount: number;
}) {
    try {
        const bill = await prisma.bill.create({
            data: {
                organizationId: data.organizationId,
                memberId: data.memberId,
                period: data.period,
                amount: data.amount,
                status: "UNPAID",
            },
        });
        revalidatePath("/dashboard/iuran");
        return { success: true, data: bill };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateBillStatus(id: string, status: BillStatus) {
    try {
        const bill = await prisma.bill.update({
            where: { id },
            data: { status },
        });

        // Optional: If PAID, maybe create a Transaction record automatically?
        // For now, keep it simple.

        revalidatePath("/dashboard/iuran");
        return { success: true, data: bill };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getBills(organizationId: string) {
    return await prisma.bill.findMany({
        where: { organizationId },
        include: { member: true },
        orderBy: { period: 'desc' }
    });
}
