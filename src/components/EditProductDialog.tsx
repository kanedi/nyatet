"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateProduct } from "@/actions/product"; // We'll make sure to export this
import { Pencil } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.coerce.number().min(0),
    costPrice: z.coerce.number().min(0),
    stock: z.coerce.number().min(0),
    unit: z.string().min(1),
    isService: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

type Product = {
    id: string;
    name: string;
    price: number;
    costPrice: number;
    stock: number;
    unit: string | null;
    isService: boolean;
};

export function EditProductDialog({ product }: { product: Product }) {
    const [open, setOpen] = useState(false);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: product.name,
            price: product.price,
            costPrice: product.costPrice || 0,
            stock: product.stock || 0,
            unit: product.unit || "pcs",
            isService: product.isService,
        },
    });

    async function onSubmit(values: FormValues) {
        const result = await updateProduct(product.id, {
            name: values.name,
            price: values.price,
            costPrice: values.costPrice,
            stock: values.stock,
            unit: values.unit,
            isService: values.isService,
        });

        if (result.success) {
            setOpen(false);
            // Optional: Toast success
        } else {
            alert(result.error);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Pencil className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Produk</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Produk</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Harga Jual</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} value={field.value as number} />
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
                                            <Input type="number" {...field} value={field.value as number} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex gap-4">
                            <FormField
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Stok</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} value={field.value as number} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="unit"
                                render={({ field }) => (
                                    <FormItem className="w-24">
                                        <FormLabel>Satuan</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="isService"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <input
                                            type="checkbox"
                                            checked={field.value}
                                            onChange={field.onChange}
                                            className="h-4 w-4"
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Jasa (Stok Unlimited)
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">Simpan Perubahan</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
