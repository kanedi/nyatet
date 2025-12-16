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
import { generateMonthlyBills } from "@/actions/bill";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Zap } from "lucide-react";

const formSchema = z.object({
    period: z.string().min(1, "Periode harus diisi (contoh: Januari 2024)"),
    amount: z.coerce.number().min(1, "Jumlah harus lebih dari 0"),
});

type FormValues = z.infer<typeof formSchema>;

export function GenerateBillDialog({ organizationId }: { organizationId: string }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema as any),
        defaultValues: {
            period: "",
            amount: 50000,
        },
    });

    async function onSubmit(values: FormValues) {
        setIsLoading(true);
        const res = await generateMonthlyBills(organizationId, values.period, values.amount);
        setIsLoading(false);

        if (res.success) {
            setOpen(false);
            form.reset();
            alert(`Berhasil membuat ${res.count} tagihan baru.`);
        } else {
            alert("Gagal: " + res.error);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Zap className="h-4 w-4" />
                    Generate Tagihan Bulanan
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generate Tagihan Massal</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="period"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Periode</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Contoh: Maret 2024" {...field} />
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
                                    <FormLabel>Jumlah per Warga</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Generate
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
