import { NextRequest, NextResponse } from "next/server";
import { verifyAPIToken } from "@/lib/auth";
import { createNewMember, getMemberList } from "../../../services/member";

export async function GET(request: NextRequest) {
    const session = await verifyAPIToken(request);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const organizationId = searchParams.get("organizationId");

    if (!organizationId) {
        return NextResponse.json({ error: "Organization ID is required" }, { status: 400 });
    }

    if (session.organizationId !== organizationId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const members = await getMemberList(organizationId);
        return NextResponse.json(members);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const session = await verifyAPIToken(request);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();

        if (!body.organizationId || !body.name) {
            return NextResponse.json({ error: "Name and Organization ID are required" }, { status: 400 });
        }

        if (session.organizationId !== body.organizationId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const member = await createNewMember({
            organizationId: body.organizationId,
            name: body.name,
            phone: body.phone,
            address: body.address,
            notes: body.notes,
        });

        return NextResponse.json(member, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
    }
}
