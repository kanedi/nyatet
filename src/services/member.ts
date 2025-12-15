import { prisma } from "@/lib/db";

export async function createNewMember(data: {
    organizationId: string;
    name: string;
    phone?: string;
    address?: string;
    notes?: string;
}) {
    return await prisma.member.create({
        data: {
            organizationId: data.organizationId,
            name: data.name,
            phone: data.phone,
            address: data.address,
            notes: data.notes,
        },
    });
}

export async function updateExistingMember(id: string, data: {
    name: string;
    phone?: string;
    address?: string;
    notes?: string;
}) {
    return await prisma.member.update({
        where: { id },
        data: {
            name: data.name,
            phone: data.phone,
            address: data.address,
            notes: data.notes,
        },
    });
}

export async function deleteExistingMember(id: string) {
    return await prisma.member.delete({ where: { id } });
}

export async function getMemberList(organizationId: string) {
    return await prisma.member.findMany({
        where: { organizationId },
        orderBy: { name: 'asc' }
    });
}
