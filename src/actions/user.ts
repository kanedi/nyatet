"use server";

import { createNewUser, deleteExistingUser, getAllUsers, updateExistingUser } from "@/services/user";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createUserAction(data: {
    email: string;
    password: string;
    role: Role;
    organizationId: string;
    name?: string;
}) {
    try {
        const user = await createNewUser(data);
        revalidatePath("/dashboard/users");
        return { success: true, data: user };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Failed to create user" };
    }
}

export async function updateUserAction(id: string, data: {
    password?: string;
    role?: Role;
    organizationId?: string;
    telegramChatId?: string;
}) {
    try {
        const user = await updateExistingUser(id, data);
        revalidatePath("/dashboard/users");
        return { success: true, data: user };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Failed to update user" };
    }
}

export async function deleteUserAction(id: string) {
    try {
        await deleteExistingUser(id);
        revalidatePath("/dashboard/users");
        return { success: true };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Failed to delete user" };
    }
}
