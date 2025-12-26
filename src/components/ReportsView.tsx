"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ReportSummaryCards } from "@/components/ReportSummaryCards";
import { ProductSalesTable } from "@/components/ProductSalesTable";
import { FinancialSummary, ProductSalesSummary } from "@/actions/report";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Download, FileSpreadsheet } from "lucide-react";

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
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleDownloadPDF = (
        period: "Harian" | "Bulanan",
        summary: FinancialSummary,
        sales: ProductSalesSummary[]
    ) => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.text(`Laporan Keuangan ${period}`, 14, 22);
        doc.setFontSize(11);
        doc.text(`Dibuat pada: ${new Date().toLocaleString("id-ID")}`, 14, 30);

        // Summary
        doc.setFontSize(14);
        doc.text("Ringkasan", 14, 45);

        const summaryData = [
            ["Pemasukan", formatCurrency(summary.revenue)],
            ["Pengeluaran", formatCurrency(summary.cost)],
            ["Keuntungan Bersih", formatCurrency(summary.profit)],
        ];

        autoTable(doc, {
            startY: 50,
            head: [["Kategori", "Jumlah"]],
            body: summaryData,
            theme: "striped",
            headStyles: { fillColor: [22, 163, 74] }, // Green-600 like
        });

        // Sales Details
        const finalY = (doc as any).lastAutoTable.finalY || 50;
        doc.text("Rincian Penjualan Produk", 14, finalY + 15);

        const salesData = sales.map((item) => [
            item.productName,
            item.quantity.toString(),
            formatCurrency(item.revenue),
        ]);

        autoTable(doc, {
            startY: finalY + 20,
            head: [["Produk", "Terjual", "Pendapatan"]],
            body: salesData,
            theme: "grid",
            headStyles: { fillColor: [37, 99, 235] }, // Blue-600 like
        });

        doc.save(`Laporan_Keuangan_${period}_${new Date().toISOString().split("T")[0]}.pdf`);
    };

    const handleExportXLSX = (
        period: "Harian" | "Bulanan",
        summary: FinancialSummary,
        sales: ProductSalesSummary[]
    ) => {
        const wb = XLSX.utils.book_new();

        // Summary Sheet
        const summaryData = [
            ["Laporan Keuangan", period],
            ["Tanggal", new Date().toLocaleString("id-ID")],
            [],
            ["Pemasukan", summary.revenue],
            ["Pengeluaran", summary.cost],
            ["Keuntungan Bersih", summary.profit],
        ];
        const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, wsSummary, "Ringkasan");

        // Sales Sheet
        const salesData = sales.map((item) => ({
            "Nama Produk": item.productName,
            "Terjual": item.quantity,
            "Pendapatan": item.revenue,
        }));
        const wsSales = XLSX.utils.json_to_sheet(salesData);
        XLSX.utils.book_append_sheet(wb, wsSales, "Penjualan Produk");

        XLSX.writeFile(wb, `Laporan_Keuangan_${period}_${new Date().toISOString().split("T")[0]}.xlsx`);
    };
    return (
        <Tabs defaultValue="daily" className="space-y-4">
            <TabsList>
                <TabsTrigger value="daily">Harian (Hari Ini)</TabsTrigger>
                <TabsTrigger value="monthly">Bulanan (Bulan Ini)</TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="space-y-4">
                <div className="flex justify-end gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExportXLSX("Harian", dailySummary, dailySales)}
                    >
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Excel
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadPDF("Harian", dailySummary, dailySales)}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        PDF
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                            if (confirm("Kirim laporan harian ke Telegram?")) {
                                const { sendReportAction } = await import("@/actions/report-trigger");
                                const res = await sendReportAction("day");
                                alert(res.message || res.error);
                            }
                        }}
                    >
                        📤 Kirim ke Telegram
                    </Button>
                </div>
                <ReportSummaryCards summary={dailySummary} />
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Rincian Penjualan Harian</h3>
                    <ProductSalesTable sales={dailySales} />
                </div>
            </TabsContent>

            <TabsContent value="monthly" className="space-y-4">
                <div className="flex justify-end gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExportXLSX("Bulanan", monthlySummary, monthlySales)}
                    >
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Excel
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadPDF("Bulanan", monthlySummary, monthlySales)}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        PDF
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                            if (confirm("Kirim laporan bulanan ke Telegram?")) {
                                const { sendReportAction } = await import("@/actions/report-trigger");
                                const res = await sendReportAction("month");
                                alert(res.message || res.error);
                            }
                        }}
                    >
                        📤 Kirim ke Telegram
                    </Button>
                </div>
                <ReportSummaryCards summary={monthlySummary} />
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Rincian Penjualan Bulanan</h3>
                    <ProductSalesTable sales={monthlySales} />
                </div>
            </TabsContent>
        </Tabs>
    );
}
