"use server";

import { createNewTransaction, getTransactionList, createCashTransactionService, getTransactionStats } from "../services/transaction";
import { revalidatePath } from "next/cache";
import { getMemberList } from "../services/member";
import { getProductList } from "../services/product";

// Create a singleton instance if needed to avoid too many connections in dev, 
// but for server actions it's often instantiated per request or via global.
// Simplicity for this snippet: using local instance.

// ... imports

// ... imports

export async function createTransaction(data: {
    organizationId: string;
    memberId?: string;
    type: "INCOME" | "EXPENSE";
    paymentMethod: "CASH" | "TRANSFER";
    date: Date;
    items: {
        productId: string;
        quantity: number;
        priceAtSale: number;
    }[];
}) {
    try {
        const result = await createNewTransaction(data);
        revalidatePath("/dashboard");
        return { success: true, data: result };
    } catch (error) {
        console.error("Transaction Error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Start Transaction Failed" };
    }
}

export async function getMembers(organizationId: string) {
    return await getMemberList(organizationId, 1, 1000);
}

export async function getProducts(organizationId: string) {
    return await getProductList(organizationId, 1, 1000);
}
export async function getTransactions(organizationId: string, page: number = 1, search?: string) {
    return await getTransactionList(organizationId, page, 20, search);
}

export async function createCashTransaction(data: {
    organizationId: string;
    type: "INCOME" | "EXPENSE";
    amount: number;
    description: string;
    date: Date;
}) {
    try {
        const result = await createCashTransactionService(data);
        revalidatePath("/dashboard/kas");
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Error" };
    }
}

export async function getStats(organizationId: string) {
    return await getTransactionStats(organizationId);
}
