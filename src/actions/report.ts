"use server";

import { getFinancialSummaryData, getProductSalesSummaryData, FinancialSummary, ProductSalesSummary } from "../services/report";

// Re-export types for frontend usage if needed (or they can import from services directly, but keeping contract here is nice)
export type { FinancialSummary, ProductSalesSummary };

export async function getFinancialSummary(
    organizationId: string,
    period: "day" | "month",
    date: Date
): Promise<FinancialSummary> {
    return await getFinancialSummaryData(organizationId, period, date);
}

export async function getProductSalesSummary(
    organizationId: string,
    period: "day" | "month",
    date: Date
): Promise<ProductSalesSummary[]> {
    return await getProductSalesSummaryData(organizationId, period, date);
}
