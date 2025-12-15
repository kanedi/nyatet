import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ProductSalesSummary } from "@/actions/report";

export function ProductSalesTable({ sales }: { sales: ProductSalesSummary[] }) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama Produk</TableHead>
                        <TableHead className="text-right">Terjual (Qty)</TableHead>
                        <TableHead className="text-right">Total Omset</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sales.map((item) => (
                        <TableRow key={item.productId}>
                            <TableCell className="font-medium">{item.productName}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">
                                Rp {item.revenue.toLocaleString()}
                            </TableCell>
                        </TableRow>
                    ))}
                    {sales.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                                Belum ada penjualan.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
