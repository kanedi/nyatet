"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

// Create a singleton instance if needed to avoid too many connections in dev, 
// but for server actions it's often instantiated per request or via global.
// Simplicity for this snippet: using local instance.

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
        const totalAmount = data.items.reduce(
            (acc, item) => acc + item.quantity * item.priceAtSale,
            0
        );

        // WRAP IN TRANSACTION
        const result = await prisma.$transaction(async (tx) => {
            // RE-IMPLEMENTATION for Atomic Cost Capture:
            // 1. Fetch all products involved
            const productIds = data.items.map(i => i.productId);
            const products = await tx.product.findMany({
                where: { id: { in: productIds } }
            });

            const productMap = new Map(products.map(p => [p.id, p]));

            // 2. Create Transaction Header & Items with Cost
            const transaction = await tx.transaction.create({
                data: {
                    organizationId: data.organizationId,
                    memberId: data.memberId,
                    type: data.type,
                    totalAmount,
                    date: data.date,
                    items: {
                        create: data.items.map((item) => {
                            const product = productMap.get(item.productId);
                            if (!product) throw new Error(`Product ${item.productId} not found`);

                            return {
                                productId: item.productId,
                                quantity: item.quantity,
                                priceAtSale: item.priceAtSale,
                                costAtSale: product.costPrice // SNAPSHOT COST
                            };
                        }),
                    },
                },
            });

            // 3. Process Stock Logic
            for (const item of data.items) {
                const product = productMap.get(item.productId)!;

                // CRITICAL LOGIC: If NOT service, decrement stock
                if (!product.isService) {
                    // Check stock sufficiency (optional, but good practice)
                    if (product.stock < item.quantity) {
                        throw new Error(`Insufficient stock for product ${product.name}`);
                    }

                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: {
                                decrement: item.quantity,
                            },
                        },
                    });
                }
            }

            return transaction;
        });

        revalidatePath("/dashboard");
        return { success: true, data: result };
    } catch (error) {
        console.error("Transaction Error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Start Transaction Failed" };
    }
}

export async function getMembers(organizationId: string) {
    return await prisma.member.findMany({ where: { organizationId } });
}

export async function getProducts(organizationId: string) {
    return await prisma.product.findMany({ where: { organizationId } });
}
export async function getTransactions(organizationId: string) {
    return await prisma.transaction.findMany({
        where: { organizationId },
        include: {
            member: { select: { name: true } },
            items: { include: { product: { select: { name: true } } } }
        },
        orderBy: { date: 'desc' },
        take: 20 // Limit to recent 20
    });
}
