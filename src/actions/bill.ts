"use server";

import { createNewBill, getBillList, updateExistingBillStatus } from "../services/bill";
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
        revalidatePath("/dashboard/iuran");
        return { success: true, data: bill };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getBills(organizationId: string) {
    return await getBillList(organizationId);
}
