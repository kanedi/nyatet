"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createUserAction } from "@/actions/user";
import { getOrganizationsAction } from "@/actions/organization";
import { Plus } from "lucide-react";

export function AddUserDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orgs, setOrgs] = useState<{ id: string; name: string; type: string }[]>([]);

    // Form State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("USER");
    const [organizationId, setOrganizationId] = useState("");

    useEffect(() => {
        if (open) {
            getOrganizationsAction().then(res => {
                if (res.success && res.data) {
                    setOrgs(res.data);
                }
            });
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await createUserAction({
            email,
            password,
            role: role as "USER" | "ADMIN" | "SUPER_ADMIN",
            organizationId
        });

        setLoading(false);

        if (res.success) {
            setOpen(false);
            // Reset form
            setEmail("");
            setPassword("");
            setRole("USER");
            setOrganizationId("");
        } else {
            alert(res.error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4" /> Add User</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>
                            Create a new user account.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input id="email" value={email} onChange={e => setEmail(e.target.value)} className="col-span-3" required type="email" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">Password</Label>
                            <Input id="password" value={password} onChange={e => setPassword(e.target.value)} className="col-span-3" required type="text" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">Role</Label>
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
                            <Label htmlFor="org" className="text-right">Org</Label>
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
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create User"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
