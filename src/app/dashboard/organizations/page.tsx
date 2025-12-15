import { getAllOrganizations } from "@/services/organization";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OrganizationListTable } from "@/components/OrganizationListTable";
import { AddOrganizationDialog } from "@/components/AddOrganizationDialog";

export default async function OrganizationManagementPage() {
    const session = await getSession();
    if (!session || session.role !== "SUPER_ADMIN") {
        redirect("/dashboard");
    }

    const orgs = await getAllOrganizations();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Organization Management</h2>
                <AddOrganizationDialog />
            </div>

            <OrganizationListTable orgs={orgs} />
        </div>
    );
}
