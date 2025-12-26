import { getSession } from "@/lib/auth";
import { getProducts, createProduct, deleteProduct } from "@/actions/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { EditProductDialog } from "@/components/EditProductDialog";
import { redirect } from "next/navigation";
import { PaginationControls } from "@/components/PaginationControls";
import { SearchInput } from "@/components/SearchInput";

export default async function ProductsPage(props: { searchParams: Promise<{ page?: string, q?: string }> }) {
    const searchParams = await props.searchParams;
    const session = await getSession();
    if (!session) redirect("/login");

    const currentPage = parseInt(searchParams?.page || "1");
    const query = searchParams?.q || "";
    const { data: products, meta } = await getProducts(session.organizationId as string, currentPage, query);

    async function create(formData: FormData) {
        "use server";
        const name = formData.get("name") as string;
        const price = parseFloat(formData.get("price") as string);
        const costPrice = parseFloat(formData.get("costPrice") as string) || 0;
        const stock = parseInt(formData.get("stock") as string) || 0;
        const isService = formData.get("isService") === "on";
        const unit = (formData.get("unit") as string) || "pcs";

        await createProduct({
            organizationId: session!.organizationId as string,
            name,
            price,
            costPrice,
            unit,
            isService,
            stock
        });
    }

    async function remove(id: string) {
        "use server";
        await deleteProduct(id);
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Manajemen Produk</h2>

            <div className="flex items-center justify-between gap-4">
                <SearchInput placeholder="Cari nama produk..." queryParam="q" />
            </div>

            {/* Create Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Tambah Produk Baru</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={create} className="flex flex-wrap gap-4 items-end">
                        <div className="flex flex-col gap-2 w-full md:w-auto">
                            <Label>Nama Produk</Label>
                            <Input name="name" placeholder="Contoh: Beras 5kg" required />
                        </div>
                        <div className="flex flex-col gap-2 w-24">
                            <Label>Harga Jual</Label>
                            <Input name="price" type="number" placeholder="0" required />
                        </div>
                        <div className="flex flex-col gap-2 w-24">
                            <Label>Modal</Label>
                            <Input name="costPrice" type="number" placeholder="0" />
                        </div>
                        <div className="flex flex-col gap-2 w-24">
                            <Label>Stok</Label>
                            <Input name="stock" type="number" placeholder="0" />
                        </div>
                        <div className="flex flex-col gap-2 w-24">
                            <Label>Satuan</Label>
                            <Input name="unit" placeholder="pcs" defaultValue="pcs" />
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                            <input type="checkbox" name="isService" id="isService" className="h-4 w-4" />
                            <Label htmlFor="isService">Jasa (Stok Unlimited)</Label>
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
                                <TableHead>Modal</TableHead>
                                <TableHead>Jual</TableHead>
                                <TableHead>Stok</TableHead>
                                <TableHead>Jenis</TableHead>
                                <TableHead className="w-[100px]">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell className="text-gray-500">Rp {product.costPrice.toLocaleString()}</TableCell>
                                    <TableCell>Rp {product.price.toLocaleString()}</TableCell>
                                    <TableCell>{product.isService ? "∞" : product.stock} {product.unit}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded text-xs ${product.isService ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                            {product.isService ? "Jasa" : "Barang"}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <EditProductDialog product={product} />
                                            <form action={remove.bind(null, product.id)}>
                                                <Button variant="ghost" size="icon" className="text-red-500">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </form>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {products.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">Belum ada produk.</TableCell>
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
