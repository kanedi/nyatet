import { getSession } from "@/lib/auth";
import { getMembers, getProducts, getTransactions } from "@/actions/transaction";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchInput } from "@/components/SearchInput";
import { Pagination } from "@/components/Pagination";
import { CashierView } from "@/components/CashierView";

export default async function DashboardPage(props: { searchParams: Promise<{ page?: string; search?: string }> }) {
    const searchParams = await props.searchParams;
    const session = await getSession();

    if (!session) return null; // Handled in layout

    if (session.role === "SUPER_ADMIN") {
        const { redirect } = await import("next/navigation");
        redirect("/dashboard/users");
    }

    // If UMKM, show POS (Transaction Form)
    if (session.organizationType === "UMKM") {
        // Fetch data for POS
        const { data: members } = await getMembers(session.organizationId as string);
        const { data: products } = await getProducts(session.organizationId as string);

        const page = parseInt(searchParams?.page || "1");
        const search = searchParams?.search || "";

        const { data: transactions, meta } = await getTransactions(
            session.organizationId as string,
            page,
            search
        );

        // Filter products for dropdown (or pass logic to component)
        // TransactionForm expects plain products.

        return (
            <CashierView
                initialMembers={members}
                initialProducts={products}
                initialTransactions={transactions}
                transactionMeta={meta}
                organizationId={session.organizationId as string}
            />
        );
    }

    // If RT, show Overview
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard RT</h2>
                <p className="text-muted-foreground">Selamat datang di panel pengurus RT.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Warga</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-muted-foreground">Orang terdaftar</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Kas Bulan Ini</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rp --</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
