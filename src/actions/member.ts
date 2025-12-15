"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createMember(data: {
    organizationId: string;
    name: string;
    phone?: string;
    address?: string;
    notes?: string;
}) {
    try {
        const member = await prisma.member.create({
            data: {
                organizationId: data.organizationId,
                name: data.name,
                phone: data.phone,
                address: data.address,
                notes: data.notes,
            },
        });
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
        const member = await prisma.member.update({
            where: { id },
            data: {
                name: data.name,
                phone: data.phone,
                address: data.address,
                notes: data.notes,
            },
        });
        revalidatePath("/dashboard/pelanggan");
        return { success: true, data: member };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteMember(id: string) {
    try {
        await prisma.member.delete({ where: { id } });
        revalidatePath("/dashboard/pelanggan");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getMembers(organizationId: string) {
    return await prisma.member.findMany({
        where: { organizationId },
        orderBy: { name: 'asc' }
    });
}
