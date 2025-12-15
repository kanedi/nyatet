import { NextRequest, NextResponse } from "next/server";
import { verifyAPIToken } from "@/lib/auth";
import { createNewUser, getAllUsers, updateExistingUser, deleteExistingUser } from "../../../../services/user";
import { Role } from "@prisma/client";

export async function GET(request: NextRequest) {
    const session = await verifyAPIToken(request);
    if (!session || session.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Forbidden: Requires SUPER_ADMIN" }, { status: 403 });
    }

    try {
        const users = await getAllUsers();
        // Mask passwords in response
        const safeUsers = users.map(u => {
            const { password, ...rest } = u;
            return rest;
        });
        return NextResponse.json(safeUsers);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const session = await verifyAPIToken(request);
    if (!session || session.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Forbidden: Requires SUPER_ADMIN" }, { status: 403 });
    }

    try {
        const body = await request.json();

        // Basic validation
        if (!body.email || !body.password || !body.organizationId) {
            return NextResponse.json({ error: "Missing email, password, or organizationId" }, { status: 400 });
        }

        const newUser = await createNewUser({
            email: body.email,
            password: body.password,
            role: body.role || "USER",
            organizationId: body.organizationId,
            name: body.name
        });

        const { password, ...safeUser } = newUser;
        return NextResponse.json(safeUser, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const session = await verifyAPIToken(request);
    if (!session || session.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Forbidden: Requires SUPER_ADMIN" }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "User ID missing" }, { status: 400 });
    }

    try {
        await deleteExistingUser(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
