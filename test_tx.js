const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testTransaction() {
    try {
        console.log("Testing Transaction Create...");

        // Get headers
        const org = await prisma.organization.findFirst({ where: { type: 'UMKM' } });
        const product = await prisma.product.create({
            data: {
                name: "Test Prod",
                price: 1000,
                stock: 10,
                organizationId: org.id
            }
        });

        const tx = await prisma.transaction.create({
            data: {
                organizationId: org.id,
                type: "INCOME",
                paymentMethod: "CASH", // Testing this field
                totalAmount: 1000,
                items: {
                    create: {
                        productId: product.id,
                        quantity: 1,
                        priceAtSale: 1000
                    }
                }
            }
        });

        console.log("Success:", tx.id);

    } catch (e) {
        console.error("Failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

testTransaction();
