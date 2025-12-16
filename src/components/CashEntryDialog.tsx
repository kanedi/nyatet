"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCashTransaction } from "@/actions/transaction";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Plus, Minus } from "lucide-react";

const formSchema = z.object({
    description: z.string().min(1, "Keterangan wajib diisi"),
    amount: z.coerce.number().min(1, "Jumlah harus lebih dari 0"),
    date: z.string(), // HTML date input returns string
});

type FormValues = z.infer<typeof formSchema>;

export function CashEntryDialog({ organizationId, type }: { organizationId: string, type: "INCOME" | "EXPENSE" }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema as any),
        defaultValues: {
            description: "",
            amount: 0,
            date: new Date().toISOString().split('T')[0],
        },
    });

    async function onSubmit(values: FormValues) {
        setIsLoading(true);
        const res = await createCashTransaction({
            organizationId,
            type,
            amount: values.amount,
            description: values.description,
            date: new Date(values.date),
        });
        setIsLoading(false);

        if (res.success) {
            setOpen(false);
            form.reset();
        } else {
            alert("Gagal: " + res.error);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={type === "INCOME" ? "default" : "destructive"} className="gap-2">
                    {type === "INCOME" ? <Plus className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                    {type === "INCOME" ? "Pemasukan" : "Pengeluaran"}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{type === "INCOME" ? "Catat Pemasukan Kas" : "Catat Pengeluaran Kas"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tanggal</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Keterangan</FormLabel>
                                    <FormControl>
                                        <Input placeholder={type === "INCOME" ? "Contoh: Sumbangan Warga" : "Contoh: Beli Konsumsi"} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Jumlah (Rp)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
