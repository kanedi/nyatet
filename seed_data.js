const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
    try {
        console.log("Seeding Database...");

        // 1. System Org & Super Admin
        let systemOrg = await prisma.organization.findFirst({ where: { type: 'SYSTEM' } });
        if (!systemOrg) {
            systemOrg = await prisma.organization.create({
                data: { name: 'System Root', type: 'SYSTEM' }
            });
            console.log("Created System Org:", systemOrg.id);
        }

        const superAdmin = await prisma.user.create({
            data: {
                email: 'superadmin@example.com',
                password: 'superpassword123', // In real app, hash this!
                role: 'SUPER_ADMIN',
                organizationId: systemOrg.id
            }
        });
        console.log("Created Super Admin:", superAdmin.email);

        // 2. UMKM Org & Admin
        let umkmOrg = await prisma.organization.create({
            data: { name: 'Warung Bu Keni', type: 'UMKM' }
        });
        console.log("Created UMKM Org:", umkmOrg.id);

        const admin = await prisma.user.create({
            data: {
                email: 'admin@example.com',
                password: 'password123',
                role: 'ADMIN',
                organizationId: umkmOrg.id
            }
        });
        console.log("Created Admin:", admin.email);

        // 3. RT Org & User
        let rtOrg = await prisma.organization.findFirst({ where: { type: 'RT' } });
        if (!rtOrg) {
            rtOrg = await prisma.organization.create({
                data: { name: 'RT 001/002', type: 'RT' }
            });
            console.log("Created RT Org:", rtOrg.id);
        } else {
            console.log("Found RT Org:", rtOrg.id);
        }

        const rtUser = await prisma.user.create({
            data: {
                email: 'rt@example.com',
                password: 'password123',
                role: 'ADMIN',
                organizationId: rtOrg.id
            }
        });
        console.log("Created RT Admin:", rtUser.email);

    } catch (e) {
        if (e.code === 'P2002') {
            console.log("Data already exists (Unique constraint). Skipping.");
        } else {
            console.error("Error seeding:", e);
        }
    } finally {
        await prisma.$disconnect();
    }
}

seed();
