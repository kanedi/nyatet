import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "../../../services/auth";
import { signJWT } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const user = await authenticateUser(email, password);

        // Generate Token
        const token = await signJWT({
            userId: user.id,
            email: user.email,
            role: user.role,
            organizationId: user.organizationId,
            organizationType: user.organization.type,
        });

        return NextResponse.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                organizationId: user.organizationId
            }
        });

    } catch (error) {
        return NextResponse.json({
            error: error instanceof Error ? error.message : "Internal Server Error"
        }, { status: 401 });
    }
}
