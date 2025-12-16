"use server";

import { revalidatePath } from "next/cache";
import { createNewProduct, deleteExistingProduct, getProductList, updateExistingProduct } from "../services/product";

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
        const product = await createNewProduct(data);
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
        const product = await updateExistingProduct(id, data);
        revalidatePath("/dashboard/produk");
        return { success: true, data: product };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Unknown Error" };
    }
}

export async function deleteProduct(id: string) {
    try {
        await deleteExistingProduct(id);
        revalidatePath("/dashboard/produk");
        return { success: true };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Unknown Error" };
    }
}

export async function getProducts(organizationId: string, page: number = 1, search?: string) {
    return await getProductList(organizationId, page, 10, search);
}
