"use server";

import { createNewMember, deleteExistingMember, getMemberList, updateExistingMember } from "../services/member";
import { revalidatePath } from "next/cache";

export async function createMember(data: {
    organizationId: string;
    name: string;
    phone?: string;
    address?: string;
    notes?: string;
}) {
    try {
        const member = await createNewMember(data);
        revalidatePath("/dashboard/pelanggan");
        return { success: true, data: member };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateMember(id: string, data: {
    name: string;
    phone?: string;
    address?: string;
    notes?: string;
}) {
    try {
        const member = await updateExistingMember(id, data);
        revalidatePath("/dashboard/pelanggan");
        return { success: true, data: member };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteMember(id: string) {
    try {
        await deleteExistingMember(id);
        revalidatePath("/dashboard/pelanggan");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getMembers(organizationId: string, page: number = 1, search?: string) {
    return await getMemberList(organizationId, page, 10, search);
}
