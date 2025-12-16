import { getSession } from "@/lib/auth";
import { getBills, createBill, updateBillStatus } from "@/actions/bill";
import { getMembers } from "@/actions/member";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import { GenerateBillDialog } from "@/components/GenerateBillDialog";
import { PaginationControls } from "@/components/PaginationControls";
import { SearchInput } from "@/components/SearchInput";

export default async function IuranPage(props: { searchParams: Promise<{ page?: string, q?: string }> }) {
    const searchParams = await props.searchParams;
    const session = await getSession();
    if (!session) redirect("/login");

    const currentPage = parseInt(searchParams?.page || "1");
    const query = searchParams?.q || "";
    const { data: bills, meta } = await getBills(session.organizationId as string, currentPage, query);
    const { data: members } = await getMembers(session.organizationId as string);

    async function create(formData: FormData) {
        "use server";
        const memberId = formData.get("memberId") as string;
        const period = formData.get("period") as string;
        const amount = parseFloat(formData.get("amount") as string);

        await createBill({
            organizationId: session!.organizationId as string,
            memberId,
            period,
            amount
        });
    }

    async function toggleStatus(id: string, currentStatus: string) {
        "use server";
        const newStatus = currentStatus === "PAID" ? "UNPAID" : "PAID";
        await updateBillStatus(id, newStatus as "PAID" | "UNPAID");
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Iuran Warga</h2>
                <GenerateBillDialog organizationId={session!.organizationId as string} />
            </div>

            <div className="flex items-center justify-between gap-4">
                <SearchInput placeholder="Cari nama warga..." />
            </div>

            {/* Create Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Catat Iuran Baru</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={create} className="flex flex-wrap gap-4 items-end">
                        <div className="flex flex-col gap-2 w-full md:w-64">
                            <Label>Warga</Label>
                            <Select name="memberId" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Warga" />
                                </SelectTrigger>
                                <SelectContent>
                                    {members.map(m => (
                                        <SelectItem key={m.id} value={m.id}>{m.name} - {m.address}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-2 w-48">
                            <Label>Periode</Label>
                            <Input name="period" placeholder="Januari 2025" required />
                        </div>
                        <div className="flex flex-col gap-2 w-40">
                            <Label>Jumlah (Rp)</Label>
                            <Input name="amount" type="number" defaultValue="50000" required />
                        </div>
                        <Button type="submit">Buat Tagihan</Button>
                    </form>
                </CardContent>
            </Card>

            {/* List */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Periode</TableHead>
                                <TableHead>Warga</TableHead>
                                <TableHead>Jumlah</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[150px]">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bills.map((bill) => (
                                <TableRow key={bill.id}>
                                    <TableCell className="font-medium">{bill.period}</TableCell>
                                    <TableCell>{bill.member.name}</TableCell>
                                    <TableCell>Rp {bill.amount.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={bill.status === "PAID" ? "default" : "destructive"}>
                                            {bill.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <form action={toggleStatus.bind(null, bill.id, bill.status)}>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className={bill.status === "PAID" ? "text-yellow-600" : "text-green-600"}
                                            >
                                                {bill.status === "PAID" ? "Batal Bayar" : "Tandai Lunas"}
                                            </Button>
                                        </form>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {bills.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">Belum ada data iuran.</TableCell>
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
