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

export async function getMemberList(organizationId: string, page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    const whereClause: any = { organizationId };

    if (search) {
        whereClause.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
            { address: { contains: search, mode: 'insensitive' } },
            { notes: { contains: search, mode: 'insensitive' } }, // Optional coverage
        ];
    }

    const [data, total] = await Promise.all([
        prisma.member.findMany({
            where: whereClause,
            orderBy: { name: 'asc' },
            take: limit,
            skip
        }),
        prisma.member.count({ where: whereClause })
    ]);

    return {
        data,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}
