const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
    try {
        console.log("Checking database...");

        // Count records
        const userCount = await prisma.user.count();
        const orgCount = await prisma.organization.count();
        const productCount = await prisma.product.count();
        const memberCount = await prisma.member.count();
        const transactionCount = await prisma.transaction.count();

        console.log("--- Data Counts ---");
        console.log(`Users: ${userCount}`);
        console.log(`Organizations: ${orgCount}`);
        console.log(`Products: ${productCount}`);
        console.log(`Members: ${memberCount}`);
        console.log(`Transactions: ${transactionCount}`);

        // List Organizations
        const orgs = await prisma.organization.findMany();
        console.log("\n--- Organizations ---");
        orgs.forEach(o => console.log(`- ${o.name} (${o.type}) ID: ${o.id}`));

        // List Users
        const users = await prisma.user.findMany({ include: { organization: true } });
        console.log("\n--- Users ---");
        users.forEach(u => console.log(`- ${u.email} (${u.role}) -> Org: ${u.organization.name}`));

    } catch (e) {
        console.error("Error connecting or querying:", e);
    } finally {
        await prisma.$disconnect();
    }
}

checkData();
