import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    // 1. Create RT Organization
    const rtOrg = await prisma.organization.create({
        data: {
            name: "RT 05 RW 02",
            type: "RT",
            users: {
                create: {
                    email: "rt@nyatet.com",
                    password: "password123", // Plaintext as per current auth impl
                    role: "ADMIN",
                },
            },
        },
    });
    console.log("Created RT User: rt@nyatet.com / password123");

    // 2. Create UMKM Organization
    const umkmOrg = await prisma.organization.create({
        data: {
            name: "Warung Berkah",
            type: "UMKM",
            users: {
                create: {
                    email: "toko@nyatet.com",
                    password: "password123",
                    role: "ADMIN",
                },
            },
            products: {
                create: [
                    { name: "Beras 5kg", price: 65000, stock: 10, isService: false },
                    { name: "Minyak Goreng 1L", price: 15000, stock: 20, isService: false },
                    { name: "Jasa Cuci Motor", price: 15000, isService: true },
                ],
            },
            members: {
                create: [
                    { name: "Budi Santoso", phone: "08123456789", address: "Jl. Mawar No 1" },
                    { name: "Siti Aminah", phone: "08987654321", address: "Jl. Melati No 2" },
                ],
            },
        },
    });
    console.log("Created UMKM User: toko@nyatet.com / password123");
    console.log("Created Initial Products & Members for UMKM");

    console.log("Seeding finished.");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
