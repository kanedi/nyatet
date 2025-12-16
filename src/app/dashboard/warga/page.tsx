import { getSession } from "@/lib/auth";
import { getMembers, createMember, deleteMember } from "@/actions/member";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { EditMemberDialog } from "@/components/EditMemberDialog";
import { redirect } from "next/navigation";
import { PaginationControls } from "@/components/PaginationControls";
import { SearchInput } from "@/components/SearchInput";

export default async function WargaPage(props: { searchParams: Promise<{ page?: string, q?: string }> }) {
    const searchParams = await props.searchParams;
    const session = await getSession();
    if (!session) redirect("/login");

    const currentPage = parseInt(searchParams?.page || "1");
    const query = searchParams?.q || "";
    const { data: members, meta } = await getMembers(session.organizationId as string, currentPage, query);

    async function create(formData: FormData) {
        "use server";
        const name = formData.get("name") as string;
        const phone = formData.get("phone") as string;
        const address = formData.get("address") as string;
        const notes = formData.get("notes") as string;

        await createMember({
            organizationId: session!.organizationId as string,
            name,
            phone,
            address,
            notes
        });
    }

    async function remove(id: string) {
        "use server";
        await deleteMember(id);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Data Warga</h2>
            </div>

            <div className="flex items-center justify-between gap-4">
                <SearchInput placeholder="Cari nama, hp, alamat..." />
            </div>

            {/* Create Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Tambah Warga Baru</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={create} className="flex flex-wrap gap-4 items-end">
                        <div className="flex flex-col gap-2 md:w-48">
                            <Label>Nama</Label>
                            <Input name="name" placeholder="Nama Warga" required />
                        </div>
                        <div className="flex flex-col gap-2 md:w-40">
                            <Label>No HP</Label>
                            <Input name="phone" placeholder="08..." />
                        </div>
                        <div className="flex flex-col gap-2 md:w-64">
                            <Label>Alamat / Blok</Label>
                            <Input name="address" placeholder="Blok A No 1" />
                        </div>
                        <div className="flex flex-col gap-2 md:w-48">
                            <Label>Catatan (Plat No)</Label>
                            <Input name="notes" placeholder="B 1234 ABC" />
                        </div>
                        <Button type="submit">Simpan</Button>
                    </form>
                </CardContent>
            </Card>

            {/* List */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>No HP</TableHead>
                                <TableHead>Alamat</TableHead>
                                <TableHead>Catatan</TableHead>
                                <TableHead className="w-[100px]">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell>{member.name}</TableCell>
                                    <TableCell>{member.phone || "-"}</TableCell>
                                    <TableCell>{member.address || "-"}</TableCell>
                                    <TableCell>{member.notes || "-"}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <EditMemberDialog member={member} />
                                            <form action={remove.bind(null, member.id)}>
                                                <Button variant="ghost" size="icon" className="text-red-500">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </form>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {members.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">Belum ada data warga.</TableCell>
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
