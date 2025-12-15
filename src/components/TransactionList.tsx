import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

type Transaction = {
    id: string;
    date: Date;
    totalAmount: number;
    member: { name: string } | null;
    items: {
        quantity: number;
        priceAtSale: number;
        product: { name: string };
    }[];
};

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Pelanggan</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((t) => (
                        <TableRow key={t.id}>
                            <TableCell>{format(t.date, "dd/MM/yyyy HH:mm")}</TableCell>
                            <TableCell>{t.member?.name || "Umum"}</TableCell>
                            <TableCell>
                                <ul className="list-disc list-inside text-sm">
                                    {t.items.map((item, idx) => (
                                        <li key={idx}>
                                            {item.product.name} ({item.quantity}x)
                                        </li>
                                    ))}
                                </ul>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                                Rp {t.totalAmount.toLocaleString()}
                            </TableCell>
                        </TableRow>
                    ))}
                    {transactions.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                                Belum ada transaksi.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
