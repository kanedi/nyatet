"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportSummaryCards } from "@/components/ReportSummaryCards";
import { ProductSalesTable } from "@/components/ProductSalesTable";
import { FinancialSummary, ProductSalesSummary } from "@/actions/report";

type ReportsViewProps = {
    dailySummary: FinancialSummary;
    dailySales: ProductSalesSummary[];
    monthlySummary: FinancialSummary;
    monthlySales: ProductSalesSummary[];
};

export function ReportsView({
    dailySummary,
    dailySales,
    monthlySummary,
    monthlySales,
}: ReportsViewProps) {
    return (
        <Tabs defaultValue="daily" className="space-y-4">
            <TabsList>
                <TabsTrigger value="daily">Harian (Hari Ini)</TabsTrigger>
                <TabsTrigger value="monthly">Bulanan (Bulan Ini)</TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="space-y-4">
                <ReportSummaryCards summary={dailySummary} />
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Rincian Penjualan Harian</h3>
                    <ProductSalesTable sales={dailySales} />
                </div>
            </TabsContent>

            <TabsContent value="monthly" className="space-y-4">
                <ReportSummaryCards summary={monthlySummary} />
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Rincian Penjualan Bulanan</h3>
                    <ProductSalesTable sales={monthlySales} />
                </div>
            </TabsContent>
        </Tabs>
    );
}
