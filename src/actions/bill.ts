"use server";

import { createNewBill, getBillList, updateExistingBillStatus, generateMonthlyBillsService } from "../services/bill";
import { createCashTransactionService } from "../services/transaction";
import { revalidatePath } from "next/cache";
import { BillStatus } from "@prisma/client";

export async function createBill(data: {
    organizationId: string;
    memberId: string;
    period: string; // e.g. "Januari 2024"
    amount: number;
}) {
    try {
        const bill = await createNewBill(data);
        revalidatePath("/dashboard/iuran");
        return { success: true, data: bill };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateBillStatus(id: string, status: BillStatus) {
    try {
        const bill = await updateExistingBillStatus(id, status);

        if (status === "PAID") {
            await createCashTransactionService({
                organizationId: bill.organizationId,
                type: "INCOME",
                amount: bill.amount,
                description: `Iuran ${bill.period} - ${bill.member.name}`,
                date: new Date(),
            });
            revalidatePath("/dashboard/kas");
        }

        revalidatePath("/dashboard/iuran");
        return { success: true, data: bill };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getBills(organizationId: string, page: number = 1, search?: string) {
    return await getBillList(organizationId, page, 10, search);
}

export async function generateMonthlyBills(
    organizationId: string,
    period: string,
    amount: number
) {
    try {
        const { count } = await generateMonthlyBillsService(organizationId, period, amount);
        revalidatePath("/dashboard/iuran");
        return { success: true, count };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
