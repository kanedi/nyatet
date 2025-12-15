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

export async function getProductList(organizationId: string) {
    return await prisma.product.findMany({
        where: { organizationId },
        orderBy: { name: 'asc' }
    });
}
