import { prisma } from "@/lib/db";
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";
// Re-export types so they can be used by both API and Action
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

export async function getFinancialSummaryData(
    organizationId: string,
    period: "day" | "month",
    date: Date
): Promise<FinancialSummary> {
    const startDate = period === "day" ? startOfDay(date) : startOfMonth(date);
    const endDate = period === "day" ? endOfDay(date) : endOfMonth(date);

    const transactions = await prisma.transaction.findMany({
        where: {
            organizationId,
            type: "INCOME", // Assuming reports only care about Income for now? Or net? Original code only checked INCOME
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

export async function getProductSalesSummaryData(
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
