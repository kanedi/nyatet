import { prisma } from "@/lib/db";
import { OrganizationType } from "@prisma/client";

export async function getAllOrganizations() {
    return await prisma.organization.findMany({
        orderBy: { name: 'asc' }
    });
}

export async function createNewOrganization(data: {
    name: string;
    type: OrganizationType;
}) {
    return await prisma.organization.create({
        data: {
            name: data.name,
            type: data.type
        }
    });
}

export async function updateExistingOrganization(id: string, data: {
    name?: string;
    type?: OrganizationType;
}) {
    return await prisma.organization.update({
        where: { id },
        data: {
            ...(data.name && { name: data.name }),
            ...(data.type && { type: data.type }),
        }
    });
}

export async function deleteExistingOrganization(id: string) {
    // Optional: Check if org has users/data before deleting?
    // For now, let Prisma error if foreign key constraint fails, or we can cascade (careful).
    // Prisma schema doesn't specify cascade Delete on User relations, so this will fail if users exist.
    // We'll let it fail for safety for now.
    return await prisma.organization.delete({
        where: { id }
    });
}
