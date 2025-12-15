import { prisma } from "@/lib/db";

export async function createNewTransaction(data: {
    organizationId: string;
    memberId?: string;
    type: "INCOME" | "EXPENSE";
    date: Date;
    items: {
        productId: string;
        quantity: number;
        priceAtSale: number;
    }[];
}) {
    const totalAmount = data.items.reduce(
        (acc, item) => acc + item.quantity * item.priceAtSale,
        0
    );

    return await prisma.$transaction(async (tx) => {
        // 1. Fetch all products involved
        const productIds = data.items.map(i => i.productId);
        const products = await tx.product.findMany({
            where: { id: { in: productIds } }
        });

        const productMap = new Map(products.map(p => [p.id, p]));

        // 2. Create Transaction Header & Items with Cost
        const transaction = await tx.transaction.create({
            data: {
                organizationId: data.organizationId,
                memberId: data.memberId,
                type: data.type,
                totalAmount,
                date: data.date,
                items: {
                    create: data.items.map((item) => {
                        const product = productMap.get(item.productId);
                        if (!product) throw new Error(`Product ${item.productId} not found`);

                        // Explicit cast or check to ensure typescript knows properties exist
                        // In a real scenario, productMap values are inferred from findMany
                        // but sometimes map.get needs help.
                        const cost = product.costPrice || 0;

                        return {
                            productId: item.productId,
                            quantity: item.quantity,
                            priceAtSale: item.priceAtSale,
                            costAtSale: cost
                        };
                    }),
                },
            },
        });

        // 3. Process Stock Logic
        for (const item of data.items) {
            const product = productMap.get(item.productId)!;

            // Explicit check to satisfy compiler if needed
            if (product) {
                if (!product.isService) {
                    if ((product.stock || 0) < item.quantity) {
                        throw new Error(`Insufficient stock for product ${product.name}`);
                    }

                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: {
                                decrement: item.quantity,
                            },
                        },
                    });
                }
            }
        }

        return transaction;
    });
}

export async function getTransactionList(organizationId: string) {
    return await prisma.transaction.findMany({
        where: { organizationId },
        include: {
            member: { select: { name: true } },
            items: { include: { product: { select: { name: true } } } }
        },
        orderBy: { date: 'desc' },
        take: 20
    });
}
