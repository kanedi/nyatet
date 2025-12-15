"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateOrganizationAction } from "@/actions/organization";

export function EditOrganizationDialog({ org, open, onOpenChange }: {
    org: any,
    open: boolean,
    onOpenChange: (open: boolean) => void
}) {
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState(org.name);
    const [type, setType] = useState(org.type);

    useEffect(() => {
        if (open) {
            setName(org.name);
            setType(org.type);
        }
    }, [open, org]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await updateOrganizationAction(org.id, {
            name,
            type: type as "RT" | "UMKM" | "SYSTEM"
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
                        <DialogTitle>Edit Organization</DialogTitle>
                        <DialogDescription>
                            Update organization details.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">Name</Label>
                            <Input id="edit-name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-type" className="text-right">Type</Label>
                            <div className="col-span-3">
                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="RT">RT</SelectItem>
                                        <SelectItem value="UMKM">UMKM</SelectItem>
                                        <SelectItem value="SYSTEM">SYSTEM</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
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
