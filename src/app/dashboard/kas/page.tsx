import { getSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { CashEntryDialog } from "@/components/CashEntryDialog";
import { getTransactions, getStats } from "@/actions/transaction";
import { PaginationControls } from "@/components/PaginationControls";
import { SearchInput } from "@/components/SearchInput";

export default async function KasPage(props: { searchParams: Promise<{ page?: string, q?: string }> }) {
    const searchParams = await props.searchParams;
    const session = await getSession();
    if (!session) redirect("/login");

    const currentPage = parseInt(searchParams?.page || "1");
    const query = searchParams?.q || "";
    const { data: transactions, meta } = await getTransactions(session.organizationId as string, currentPage, query);
    const { totalIncome, totalExpense, balance } = await getStats(session.organizationId as string);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Kas & Transaksi</h2>
                <div className="flex gap-2">
                    <CashEntryDialog organizationId={session!.organizationId as string} type="INCOME" />
                    <CashEntryDialog organizationId={session!.organizationId as string} type="EXPENSE" />
                </div>
            </div>

            <div className="flex items-center justify-between gap-4">
                <SearchInput placeholder="Cari keterangan atau warga..." />
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-green-50 border-green-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-green-800">Total Pemasukan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-900">Rp {totalIncome.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card className="bg-red-50 border-red-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-red-800">Total Pengeluaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-900">Rp {totalExpense.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-blue-800">Saldo Akhir</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-900">Rp {balance.toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div>

            {/* List */}
            <Card>
                <CardHeader>
                    <CardTitle>Riwayat Transaksi</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Tipe</TableHead>
                                <TableHead>Keterangan / Member</TableHead>
                                <TableHead className="text-right">Jumlah</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((t) => (
                                <TableRow key={t.id}>
                                    <TableCell>{format(t.date, "dd MMMM yyyy HH:mm", { locale: idLocale })}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded text-xs ${t.type === 'INCOME' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {t.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{t.description || t.member?.name || "-"}</span>
                                            {t.member && t.description && <span className="text-xs text-muted-foreground">Oleh: {t.member.name}</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell className={`text-right font-medium ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                        {t.type === 'INCOME' ? '+' : '-'} Rp {t.totalAmount.toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {transactions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">Belum ada transaksi.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <PaginationControls totalPages={meta.totalPages} currentPage={meta.page} />
                </CardContent>
            </Card>
        </div>
    );
}
