const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Fixing Super Admin Organization...");

    // 1. Create System Organization
    let sysOrg = await prisma.organization.findFirst({
        where: { type: 'SYSTEM' }
    });

    if (!sysOrg) {
        console.log("Creating SYSTEM Organization...");
        sysOrg = await prisma.organization.create({
            data: {
                name: "System Root",
                type: "SYSTEM"
            }
        });
    }

    // 2. Find Super Admin
    const superAdmin = await prisma.user.findFirst({
        where: { role: 'SUPER_ADMIN' }
    });

    if (superAdmin) {
        console.log(`Updating Super Admin ${superAdmin.email} to System Org...`);
        await prisma.user.update({
            where: { id: superAdmin.id },
            data: { organizationId: sysOrg.id }
        });
        console.log("Done.");
    } else {
        console.log("Super Admin not found!");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
