import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";

export async function getAllUsers() {
    return await prisma.user.findMany({
        include: { organization: true },
        orderBy: { email: 'asc' }
    });
}

export async function createNewUser(data: {
    email: string;
    password: string;
    role: Role;
    organizationId: string;
    name?: string; // Optional if we add name later
}) {
    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new Error("User with this email already exists");

    return await prisma.user.create({
        data: {
            email: data.email,
            password: data.password, // Ideally hash this!
            role: data.role,
            organizationId: data.organizationId,
        },
    });
}

export async function updateExistingUser(id: string, data: {
    password?: string;
    role?: Role;
    organizationId?: string;
    telegramChatId?: string;
}) {
    return await prisma.user.update({
        where: { id },
        data: {
            ...(data.password && { password: data.password }),
            ...(data.role && { role: data.role }),
            ...(data.organizationId && { organizationId: data.organizationId }),
            ...(data.telegramChatId && { telegramChatId: data.telegramChatId }),
        },
    });
}

export async function deleteExistingUser(id: string) {
    return await prisma.user.delete({
        where: { id },
    });
}
