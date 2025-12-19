import { prisma } from "@/lib/db";

export async function createNewTransaction(data: {
    organizationId: string;
    memberId?: string;
    type: "INCOME" | "EXPENSE";
    paymentMethod: "CASH" | "TRANSFER";
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
                paymentMethod: data.paymentMethod,
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

export async function getTransactionList(organizationId: string, page: number = 1, limit: number = 20, search?: string) {
    const skip = (page - 1) * limit;
    const whereClause: any = { organizationId };

    if (search) {
        whereClause.OR = [
            { description: { contains: search, mode: 'insensitive' } },
            { member: { name: { contains: search, mode: 'insensitive' } } }
        ];
    }

    const [data, total] = await Promise.all([
        prisma.transaction.findMany({
            where: whereClause,
            include: {
                member: { select: { name: true } },
                items: { include: { product: { select: { name: true } } } }
            },
            orderBy: { date: 'desc' },
            take: limit,
            skip
        }),
        prisma.transaction.count({ where: whereClause })
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

export async function createCashTransactionService(data: {
    organizationId: string;
    type: "INCOME" | "EXPENSE";
    amount: number;
    description: string;
    date: Date;
}) {
    return await prisma.transaction.create({
        data: {
            organizationId: data.organizationId,
            type: data.type,
            totalAmount: data.amount,
            date: data.date,
            description: data.description,
        },
    });
}

export async function getTransactionStats(organizationId: string) {
    const stats = await prisma.transaction.groupBy({
        by: ['type'],
        where: { organizationId },
        _sum: {
            totalAmount: true,
        },
    });

    const income = stats.find(s => s.type === 'INCOME')?._sum.totalAmount || 0;
    const expense = stats.find(s => s.type === 'EXPENSE')?._sum.totalAmount || 0;

    return {
        totalIncome: income,
        totalExpense: expense,
        balance: income - expense
    };
}
