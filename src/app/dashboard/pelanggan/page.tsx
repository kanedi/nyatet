import { getSession } from "@/lib/auth";
import { getMembers, createMember, deleteMember } from "@/actions/member";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { redirect } from "next/navigation";

import { PaginationControls } from "@/components/PaginationControls";
import { SearchInput } from "@/components/SearchInput";

export default async function MembersPage(props: { searchParams: Promise<{ page?: string, q?: string }> }) {
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

        await createMember({
            organizationId: session!.organizationId as string,
            name,
            phone,
            address
        });
    }

    async function remove(id: string) {
        "use server";
        await deleteMember(id);
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Manajemen Pelanggan</h2>

            <div className="flex items-center justify-between gap-4">
                <SearchInput placeholder="Cari nama, hp, alamat..." />
            </div>

            {/* Create Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Tambah Pelanggan Baru</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={create} className="flex flex-wrap gap-4 items-end">
                        <div className="flex flex-col gap-2 w-full md:w-auto">
                            <Label>Nama</Label>
                            <Input name="name" placeholder="Nama Pelanggan" required />
                        </div>
                        <div className="flex flex-col gap-2 w-full md:w-auto">
                            <Label>No HP</Label>
                            <Input name="phone" placeholder="08..." />
                        </div>
                        <div className="flex flex-col gap-2 w-full md:w-64">
                            <Label>Alamat</Label>
                            <Input name="address" placeholder="Alamat..." />
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
                                <TableHead className="w-[100px]">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell>{member.name}</TableCell>
                                    <TableCell>{member.phone || "-"}</TableCell>
                                    <TableCell>{member.address || "-"}</TableCell>
                                    <TableCell>
                                        <form action={remove.bind(null, member.id)}>
                                            <Button variant="ghost" size="icon" className="text-red-500">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </form>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {members.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">Belum ada data pelanggan.</TableCell>
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
