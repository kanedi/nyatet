"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteUserAction } from "@/actions/user";
import { Edit, Trash2 } from "lucide-react";
import { EditUserDialog } from "./EditUserDialog";

export function UserListTable({ users }: { users: any[] }) {
    const [editingUser, setEditingUser] = useState<any>(null);

    const handleDelete = async (id: string, email: string) => {
        if (confirm(`Are you sure you want to delete user ${email}?`)) {
            const res = await deleteUserAction(id);
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.organization.name} <span className="text-xs text-gray-400">({user.organization.type})</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Button variant="ghost" size="sm" onClick={() => setEditingUser(user)}>
                                    <Edit className="h-4 w-4 text-blue-500" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id, user.email)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editingUser && (
                <EditUserDialog
                    user={editingUser}
                    open={!!editingUser}
                    onOpenChange={(open) => !open && setEditingUser(null)}
                />
            )}
        </div>
    );
}
