import { getSession } from "@/lib/auth";
import { getMembers, getProducts, getTransactions } from "@/actions/transaction";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
    const session = await getSession();

    if (!session) return null; // Handled in layout

    // If UMKM, show POS (Transaction Form)
    if (session.organizationType === "UMKM") {
        // Fetch data for POS
        const members = await getMembers(session.organizationId as string);
        const products = await getProducts(session.organizationId as string);

        const transactions = await getTransactions(session.organizationId as string);

        // Filter products for dropdown (or pass logic to component)
        // TransactionForm expects plain products.

        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Kasir (POS)</h2>
                    <p className="text-muted-foreground">Catat transaksi baru.</p>
                </div>
                <TransactionForm
                    organizationId={session.organizationId as string}
                    members={members}
                    products={products}
                />

                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Riwayat Transaksi Terakhir</h3>
                    <TransactionList transactions={transactions} />
                </div>
            </div>
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
