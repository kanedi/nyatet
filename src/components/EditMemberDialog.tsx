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
import { updateMember } from "@/actions/member";
import { Pencil } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    phone: z.string(),
    address: z.string(),
    notes: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

type Member = {
    id: string;
    name: string;
    phone: string | null;
    address: string | null;
    notes: string | null;
};

export function EditMemberDialog({ member }: { member: Member }) {
    const [open, setOpen] = useState(false);
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: member.name,
            phone: member.phone || "",
            address: member.address || "",
            notes: member.notes || "",
        },
    });

    async function onSubmit(values: FormValues) {
        const result = await updateMember(member.id, {
            name: values.name,
            phone: values.phone,
            address: values.address,
            notes: values.notes,
        });

        if (result.success) {
            setOpen(false);
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
                    <DialogTitle>Edit Warga</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>No HP</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="08..." />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Alamat</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Catatan (Plat No)</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
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
