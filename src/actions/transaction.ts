"use server";

import { createNewTransaction, getTransactionList } from "../services/transaction";
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
    return await getMemberList(organizationId);
}

export async function getProducts(organizationId: string) {
    return await getProductList(organizationId);
}
export async function getTransactions(organizationId: string) {
    return await getTransactionList(organizationId);
}
