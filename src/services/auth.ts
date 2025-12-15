import { prisma } from "@/lib/db";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export async function authenticateUser(email: string, password: string) {
    const validated = loginSchema.safeParse({ email, password });

    if (!validated.success) {
        throw new Error("Invalid fields");
    }

    const user = await prisma.user.findUnique({
        where: { email },
        include: { organization: true },
    });

    if (!user || user.password !== password) {
        throw new Error("Invalid credentials");
    }

    return user;
}
