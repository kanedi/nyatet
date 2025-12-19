"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateUserAction } from "@/actions/user";
import { getOrganizationsAction } from "@/actions/organization";

export function EditUserDialog({ user, open, onOpenChange }: {
    user: any,
    open: boolean,
    onOpenChange: (open: boolean) => void
}) {
    const [loading, setLoading] = useState(false);
    const [orgs, setOrgs] = useState<{ id: string; name: string; type: string }[]>([]);

    // Form State
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(user.role);
    const [organizationId, setOrganizationId] = useState(user.organizationId);
    const [telegramChatId, setTelegramChatId] = useState(user.telegramChatId || "");

    useEffect(() => {
        if (open) {
            getOrganizationsAction().then(res => {
                if (res.success && res.data) {
                    setOrgs(res.data);
                }
            });
            // Reset form to user values
            setRole(user.role);
            setOrganizationId(user.organizationId);
            setTelegramChatId(user.telegramChatId || "");
            setPassword("");
        }
    }, [open, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await updateUserAction(user.id, {
            password: password || undefined, // Only send if set
            role: role as "USER" | "ADMIN" | "SUPER_ADMIN",
            organizationId,
            telegramChatId: telegramChatId || undefined
        });

        setLoading(false);

        if (res.success) {
            onOpenChange(false);
        } else {
            alert(res.error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit User: {user.email}</DialogTitle>
                        <DialogDescription>
                            Update user details. Leave password blank to keep unchanged.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-password" className="text-right">Password</Label>
                            <Input id="edit-password" value={password} onChange={e => setPassword(e.target.value)} className="col-span-3" type="text" placeholder="(Unchanged)" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-role" className="text-right">Role</Label>
                            <div className="col-span-3">
                                <Select value={role} onValueChange={setRole}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USER">USER</SelectItem>
                                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                                        <SelectItem value="SUPER_ADMIN">SUPER_ADMIN</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-org" className="text-right">Org</Label>
                            <div className="col-span-3">
                                <Select value={organizationId} onValueChange={setOrganizationId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select organization" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {orgs.map(org => (
                                            <SelectItem key={org.id} value={org.id}>
                                                {org.name} ({org.type})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-telegram" className="text-right">Telegram ID</Label>
                            <Input id="edit-telegram" value={telegramChatId} onChange={e => setTelegramChatId(e.target.value)} className="col-span-3" type="text" placeholder="e.g. 123456789" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
