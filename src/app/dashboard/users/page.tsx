import { getAllUsers } from "@/services/user";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserListTable } from "@/components/UserListTable";
import { AddUserDialog } from "@/components/AddUserDialog";

export default async function UserManagementPage() {
    const session = await getSession();
    if (!session || session.role !== "SUPER_ADMIN") {
        redirect("/dashboard");
    }

    const users = await getAllUsers();
    // Serialize dates or specialized objects if necessary before passing to client component
    // Prisma objects are usually fine unless they contain Dates that need .toISOString() or similar IF passing to Client Components directly? 
    // Next.js Server Components -> Client Components serialization handles Dates automatically now in recent versions, but essentially passing Plain Objects is safest.
    // Let's verify build.

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">User Management</h2>
                <AddUserDialog />
            </div>

            <UserListTable users={users} />
        </div>
    );
}
