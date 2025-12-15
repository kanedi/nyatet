"use server";

import { createNewOrganization, deleteExistingOrganization, getAllOrganizations, updateExistingOrganization } from "@/services/organization";
import { OrganizationType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getOrganizationsAction() {
    try {
        const orgs = await getAllOrganizations();
        return { success: true, data: orgs };
    } catch (error) {
        return { success: false, error: "Failed to fetch organizations" };
    }
}

export async function createOrganizationAction(data: { name: string; type: OrganizationType }) {
    try {
        const org = await createNewOrganization(data);
        revalidatePath("/dashboard/organizations");
        return { success: true, data: org };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Failed to create organization" };
    }
}

export async function updateOrganizationAction(id: string, data: { name?: string; type?: OrganizationType }) {
    try {
        const org = await updateExistingOrganization(id, data);
        revalidatePath("/dashboard/organizations");
        return { success: true, data: org };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Failed to update organization" };
    }
}

export async function deleteOrganizationAction(id: string) {
    try {
        await deleteExistingOrganization(id);
        revalidatePath("/dashboard/organizations");
        return { success: true };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Failed to delete organization (ensure no users assigned)" };
    }
}
