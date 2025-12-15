import { getSession } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const prisma = new PrismaClient();

// We'll just fetch directly here for simplicity of the view
async function getTransactions(organizationId: string) {
    return await prisma.transaction.findMany({
        where: { organizationId },
        include: { member: true },
        orderBy: { date: 'desc' }
    });
}

export default async function KasPage() {
    const session = await getSession();
    if (!session) redirect("/login");

    const transactions = await getTransactions(session.organizationId as string);

    const totalIncome = transactions
        .filter(t => t.type === "INCOME")
        .reduce((acc, t) => acc + t.totalAmount, 0);

    const totalExpense = transactions
        .filter(t => t.type === "EXPENSE")
        .reduce((acc, t) => acc + t.totalAmount, 0);

    const balance = totalIncome - totalExpense;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Kas & Transaksi</h2>

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
                                    <TableCell>{t.member?.name || "-"}</TableCell>
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
                </CardContent>
            </Card>
        </div>
    );
}
