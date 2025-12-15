"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createProduct(data: {
    organizationId: string;
    name: string;
    price: number;
    unit: string;
    isService: boolean;
    costPrice?: number;
    stock?: number;
}) {
    try {
        const product = await prisma.product.create({
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
        revalidatePath("/dashboard/produk");
        return { success: true, data: product };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Unknown Error" };
    }
}

export async function updateProduct(id: string, data: {
    name: string;
    price: number;
    unit: string;
    isService: boolean;
    costPrice?: number;
    stock?: number;
}) {
    try {
        const product = await prisma.product.update({
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
        revalidatePath("/dashboard/produk");
        return { success: true, data: product };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Unknown Error" };
    }
}

export async function deleteProduct(id: string) {
    try {
        await prisma.product.delete({ where: { id } });
        revalidatePath("/dashboard/produk");
        return { success: true };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Unknown Error" };
    }
}

export async function getProducts(organizationId: string) {
    return await prisma.product.findMany({
        where: { organizationId },
        orderBy: { name: 'asc' }
    });
}
