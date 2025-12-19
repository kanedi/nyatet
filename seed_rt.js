const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedRT() {
    try {
        console.log("Seeding RT User...");

        let rtOrg = await prisma.organization.findFirst({ where: { type: 'RT' } });
        if (!rtOrg) {
            rtOrg = await prisma.organization.create({
                data: { name: 'RT 001/002', type: 'RT' }
            });
            console.log("Created RT Org:", rtOrg.id);
        } else {
            console.log("Found RT Org:", rtOrg.id);
        }

        const rtUserToCheck = await prisma.user.findUnique({ where: { email: 'rt@example.com' } });
        if (!rtUserToCheck) {
            const rtUser = await prisma.user.create({
                data: {
                    email: 'rt@example.com',
                    password: 'password123',
                    role: 'ADMIN',
                    organizationId: rtOrg.id
                }
            });
            console.log("Created RT Admin:", rtUser.email);
        } else {
            console.log("RT Admin already exists.");
        }

    } catch (e) {
        console.error("Error seeding RT:", e);
    } finally {
        await prisma.$disconnect();
    }
}

seedRT();
