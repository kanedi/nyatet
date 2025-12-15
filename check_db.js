const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users.`);

    if (users.length === 0) {
        console.log("No users found. Creating default admin...");

        // Create Org first
        const org = await prisma.organization.create({
            data: {
                name: "Test Organization",
                type: "UMKM"
            }
        });

        // Create User
        const user = await prisma.user.create({
            data: {
                email: "admin@example.com",
                password: "password123", // In real app, hash this!
                role: "ADMIN",
                organizationId: org.id
            }
        });
        console.log("Created user: admin@example.com / password123");
        console.log("Org ID:", org.id);
    } else {
        console.log("User exists. Email:", users[0].email);
        console.log("Org ID:", users[0].organizationId);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
