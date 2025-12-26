"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { createTransaction } from "@/actions/transaction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

const formSchema = z.object({
    memberId: z.string().optional(),
    paymentMethod: z.enum(["CASH", "TRANSFER"]),
    items: z.array(
        z.object({
            productId: z.string().min(1, "Product is required"),
            quantity: z.number().min(1, "Quantity must be at least 1"),
            priceAtSale: z.number().min(0),
        })
    ).min(1, "At least one item is required"),
});

type TransactionFormProps = {
    organizationId: string;
    members: { id: string; name: string }[];
    products: { id: string; name: string; price: number; isService: boolean }[];
};

export function TransactionForm({ organizationId, members, products }: TransactionFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            paymentMethod: "CASH",
            items: [{ productId: "", quantity: 1, priceAtSale: 0 }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    });

    const watchItems = form.watch("items");

    // Calculate total
    const total = watchItems.reduce((acc, item) => {
        return acc + (item.quantity || 0) * (item.priceAtSale || 0);
    }, 0);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const result = await createTransaction({
            organizationId,
            memberId: values.memberId || undefined,
            type: "INCOME", // Default to INCOME for POS
            paymentMethod: values.paymentMethod,
            date: new Date(),
            items: values.items.map((i) => ({
                productId: i.productId,
                quantity: i.quantity,
                priceAtSale: i.priceAtSale,
            })),
        });

        if (result.success) {
            alert("Transaction Saved!");
            form.reset();
        } else {
            alert("Error: " + result.error);
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>New Transaction</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="memberId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Member (Customer)</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Member" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {members.map((m) => (
                                                <SelectItem key={m.id} value={m.id}>
                                                    {m.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="paymentMethod"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payment Method</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Payment Method" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="CASH">Cash</SelectItem>
                                            <SelectItem value="TRANSFER">Transfer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <FormLabel>Items</FormLabel>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => append({ productId: "", quantity: 1, priceAtSale: 0 })}
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Add Item
                                </Button>
                            </div>

                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-4 items-end border p-4 rounded-md">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.productId`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Product</FormLabel>
                                                <Select
                                                    onValueChange={(val) => {
                                                        field.onChange(val);
                                                        const p = products.find((p) => p.id === val);
                                                        if (p) {
                                                            form.setValue(`items.${index}.priceAtSale`, p.price);
                                                        }
                                                    }}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Product" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {products.map((p) => (
                                                            <SelectItem key={p.id} value={p.id}>
                                                                {p.name} ({p.price})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.quantity`}
                                        render={({ field }) => (
                                            <FormItem className="w-24">
                                                <FormLabel>Qty</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.priceAtSale`}
                                        render={({ field }) => (
                                            <FormItem className="w-32">
                                                <FormLabel>Price</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        readOnly // Usually from product, but can be editable if needed. Keeping readOnly for now or editable? User said "Dynamic Calculation", standard POS price is usually fixed but editable. Let's allowing edit but creating defaults.
                                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center bg-muted p-4 rounded-lg">
                            <span className="font-semibold text-lg">Total</span>
                            <span className="font-bold text-xl">{total.toLocaleString()}</span>
                        </div>

                        <Button type="submit" className="w-full">
                            Process Transaction
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
