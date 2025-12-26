"use client";

import { useState } from "react";
import { TransactionForm } from "./TransactionForm";
import { QuickActionsCard } from "./QuickActionsCard";
import { TransactionList } from "./TransactionList";
import { Pagination } from "./Pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchInput } from "@/components/SearchInput";

type CashierViewProps = {
    initialMembers: any[];
    initialProducts: any[];
    initialTransactions: any[];
    transactionMeta: any;
    organizationId: string;
};

export function CashierView({
    initialMembers,
    initialProducts,
    initialTransactions,
    transactionMeta,
    organizationId,
}: CashierViewProps) {
    const [members, setMembers] = useState(initialMembers);
    const [products, setProducts] = useState(initialProducts);

    const handleMemberAdded = (newMember: any) => {
        setMembers((prev) => [...prev, newMember]);
    };

    const handleProductAdded = (newProduct: any) => {
        setProducts((prev) => [...prev, newProduct]);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Kasir (POS)</h2>
                <p className="text-muted-foreground">Catat transaksi baru.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <TransactionForm
                        organizationId={organizationId}
                        members={members}
                        products={products}
                    />
                </div>
                <div className="lg:col-span-1">
                    <QuickActionsCard
                        organizationId={organizationId}
                        onMemberAdded={handleMemberAdded}
                        onProductAdded={handleProductAdded}
                    />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Riwayat Transaksi</CardTitle>
                        <div className="w-full md:w-auto">
                            <SearchInput placeholder="Cari transaksi..." />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <TransactionList transactions={initialTransactions} />
                    <Pagination totalPages={transactionMeta.totalPages} />
                </CardContent>
            </Card>
        </div>
    );
}
