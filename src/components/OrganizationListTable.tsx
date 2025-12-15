"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteOrganizationAction } from "@/actions/organization";
import { Edit, Trash2 } from "lucide-react";
import { EditOrganizationDialog } from "./EditOrganizationDialog";

export function OrganizationListTable({ orgs }: { orgs: any[] }) {
    const [editingOrg, setEditingOrg] = useState<any>(null);

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete organization ${name}? This will fail if users are assigned.`)) {
            const res = await deleteOrganizationAction(id);
            if (!res.success) {
                alert(res.error);
            }
        }
    };

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {orgs.map((org) => (
                        <tr key={org.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{org.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{org.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(org.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Button variant="ghost" size="sm" onClick={() => setEditingOrg(org)}>
                                    <Edit className="h-4 w-4 text-blue-500" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(org.id, org.name)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editingOrg && (
                <EditOrganizationDialog
                    org={editingOrg}
                    open={!!editingOrg}
                    onOpenChange={(open) => !open && setEditingOrg(null)}
                />
            )}
        </div>
    );
}
