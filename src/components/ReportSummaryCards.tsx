import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FinancialSummary } from "@/actions/report";

export function ReportSummaryCards({ summary }: { summary: FinancialSummary }) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Omset</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                        Rp {summary.revenue.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {summary.transactionCount} transaksi
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Modal</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-500">
                        Rp {summary.cost.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Harga Pokok Penjualan (HPP)
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Laba Bersih</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${summary.profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        Rp {summary.profit.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Omset - Modal
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
