"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuickAddMemberForm } from "./QuickAddMemberForm";
import { QuickAddProductForm } from "./QuickAddProductForm";

type QuickActionsCardProps = {
    organizationId: string;
    onMemberAdded: (member: any) => void;
    onProductAdded: (product: any) => void;
};

export function QuickActionsCard({ organizationId, onMemberAdded, onProductAdded }: QuickActionsCardProps) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="member" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="member">Pelanggan</TabsTrigger>
                        <TabsTrigger value="product">Produk</TabsTrigger>
                    </TabsList>
                    <TabsContent value="member">
                        <QuickAddMemberForm organizationId={organizationId} onSuccess={onMemberAdded} />
                    </TabsContent>
                    <TabsContent value="product">
                        <QuickAddProductForm organizationId={organizationId} onSuccess={onProductAdded} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
