import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getFinancialSummary, getProductSalesSummary } from "@/actions/report";
import { ReportsView } from "@/components/ReportsView";

export default async function ReportsPage() {
    const session = await getSession();
    if (!session || session.organizationType !== "UMKM") {
        return redirect("/dashboard");
    }

    const today = new Date();

    const [dailySummary, dailySales, monthlySummary, monthlySales] = await Promise.all([
        getFinancialSummary(session.organizationId as string, "day", today),
        getProductSalesSummary(session.organizationId as string, "day", today),
        getFinancialSummary(session.organizationId as string, "month", today),
        getProductSalesSummary(session.organizationId as string, "month", today),
    ]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Laporan Keuangan</h2>
                <p className="text-muted-foreground">Analisa performa toko anda.</p>
            </div>

            <ReportsView
                dailySummary={dailySummary}
                dailySales={dailySales}
                monthlySummary={monthlySummary}
                monthlySales={monthlySales}
            />
        </div>
    );
}
