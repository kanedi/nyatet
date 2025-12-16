import { prisma } from "@/lib/db";

export async function createNewProduct(data: {
    organizationId: string;
    name: string;
    price: number;
    unit: string;
    isService: boolean;
    costPrice?: number;
    stock?: number;
}) {
    return await prisma.product.create({
        data: {
            organizationId: data.organizationId,
            name: data.name,
            price: data.price,
            costPrice: data.costPrice || 0,
            unit: data.unit,
            isService: data.isService,
            stock: data.isService ? 0 : data.stock || 0,
        },
    });
}

export async function updateExistingProduct(id: string, data: {
    name: string;
    price: number;
    unit: string;
    isService: boolean;
    costPrice?: number;
    stock?: number;
}) {
    return await prisma.product.update({
        where: { id },
        data: {
            name: data.name,
            price: data.price,
            costPrice: data.costPrice || 0,
            unit: data.unit,
            isService: data.isService,
            stock: data.isService ? 0 : data.stock || 0,
        },
    });
}

export async function deleteExistingProduct(id: string) {
    return await prisma.product.delete({ where: { id } });
}

export async function getProductList(organizationId: string, page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    const whereClause: any = { organizationId };

    if (search) {
        whereClause.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { unit: { contains: search, mode: 'insensitive' } },
        ];
    }

    const [data, total] = await Promise.all([
        prisma.product.findMany({
            where: whereClause,
            orderBy: { name: 'asc' },
            take: limit,
            skip
        }),
        prisma.product.count({ where: whereClause })
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
