"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createMember } from "@/actions/member";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    phone: z.string().optional(),
    address: z.string().optional(),
});

type QuickAddMemberFormProps = {
    organizationId: string;
    onSuccess: (member: any) => void;
};

export function QuickAddMemberForm({ organizationId, onSuccess }: QuickAddMemberFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            phone: "",
            address: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const result = await createMember({
                organizationId,
                name: values.name,
                phone: values.phone,
                address: values.address,
            });

            if (result.success) {
                form.reset();
                onSuccess(result.data);
            } else {
                alert("Error: " + result.error);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to create member");
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
                            <FormLabel>Nama</FormLabel>
                            <FormControl>
                                <Input placeholder="Nama Pelanggan" {...field} />
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
                            <FormLabel>No HP (Opsional)</FormLabel>
                            <FormControl>
                                <Input placeholder="08..." {...field} />
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
                            <FormLabel>Alamat (Opsional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Alamat..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Simpan Pelanggan
                </Button>
            </form>
        </Form>
    );
}
