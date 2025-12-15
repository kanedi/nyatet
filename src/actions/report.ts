"use server";

import { PrismaClient } from "@prisma/client";
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";

const prisma = new PrismaClient();

export type FinancialSummary = {
    revenue: number;
    cost: number;
    profit: number;
    transactionCount: number;
};

export type ProductSalesSummary = {
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
};

export async function getFinancialSummary(
    organizationId: string,
    period: "day" | "month",
    date: Date
): Promise<FinancialSummary> {
    const startDate = period === "day" ? startOfDay(date) : startOfMonth(date);
    const endDate = period === "day" ? endOfDay(date) : endOfMonth(date);

    const transactions = await prisma.transaction.findMany({
        where: {
            organizationId,
            type: "INCOME",
            date: {
                gte: startDate,
                lte: endDate,
            },
        },
        include: {
            items: true,
        },
    });

    let revenue = 0;
    let cost = 0;

    for (const t of transactions) {
        revenue += t.totalAmount;
        for (const item of t.items) {
            cost += item.costAtSale * item.quantity;
        }
    }

    return {
        revenue,
        cost,
        profit: revenue - cost,
        transactionCount: transactions.length,
    };
}

export async function getProductSalesSummary(
    organizationId: string,
    period: "day" | "month",
    date: Date
): Promise<ProductSalesSummary[]> {
    const startDate = period === "day" ? startOfDay(date) : startOfMonth(date);
    const endDate = period === "day" ? endOfDay(date) : endOfMonth(date);

    const items = await prisma.transactionItem.findMany({
        where: {
            transaction: {
                organizationId,
                type: "INCOME",
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        },
        include: {
            product: true,
        },
    });

    const summaryMap = new Map<string, ProductSalesSummary>();

    for (const item of items) {
        // Handle potentially missing products if soft-deleted (though schema doesn't show soft delete, safer to check)
        if (!item.product) continue;

        const existing = summaryMap.get(item.productId);
        if (existing) {
            existing.quantity += item.quantity;
            existing.revenue += item.priceAtSale * item.quantity;
        } else {
            summaryMap.set(item.productId, {
                productId: item.productId,
                productName: item.product.name,
                quantity: item.quantity,
                revenue: item.priceAtSale * item.quantity,
            });
        }
    }

    return Array.from(summaryMap.values()).sort((a, b) => b.revenue - a.revenue);
}
