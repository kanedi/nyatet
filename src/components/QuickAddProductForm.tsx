"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createProduct } from "@/actions/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.number().min(0, "Price must be positive"),
    costPrice: z.number().min(0, "Cost Price must be positive"),
    stock: z.number().min(0, "Stock must be positive"),
    unit: z.string().min(1, "Unit is required"),
    isService: z.boolean(),
});

type QuickAddProductFormProps = {
    organizationId: string;
    onSuccess: (product: any) => void;
};

export function QuickAddProductForm({ organizationId, onSuccess }: QuickAddProductFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            price: 0,
            costPrice: 0,
            stock: 0,
            unit: "pcs",
            isService: false,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const result = await createProduct({
                organizationId,
                name: values.name,
                price: values.price,
                stock: values.stock,
                unit: values.unit,
                isService: values.isService,
                costPrice: values.costPrice,
            });

            if (result.success) {
                form.reset();
                onSuccess(result.data);
            } else {
                alert("Error: " + result.error);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to create product");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nama Produk</FormLabel>
                            <FormControl>
                                <Input placeholder="Nama Produk" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-2">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Harga Jual</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        {...field}
                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="costPrice"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Modal</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        {...field}
                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Stok Awal</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        {...field}
                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Satuan</FormLabel>
                            <FormControl>
                                <Input placeholder="pcs" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Simpan Produk
                </Button>
            </form>
        </Form>
    );
}
