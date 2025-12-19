import { NextRequest, NextResponse } from "next/server";
import { verifyAPIToken } from "@/lib/auth";
import { createNewTransaction, getTransactionList } from "../../../services/transaction";

export async function GET(request: NextRequest) {
    const session = await verifyAPIToken(request);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const organizationId = searchParams.get("organizationId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("q") || undefined;

    if (!organizationId) {
        return NextResponse.json({ error: "Organization ID is required" }, { status: 400 });
    }

    if (session.organizationId !== organizationId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const result = await getTransactionList(organizationId, page, limit, search);
        return NextResponse.json(result);
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

        if (!body.organizationId || !body.items || !Array.isArray(body.items)) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        if (session.organizationId !== body.organizationId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const transaction = await createNewTransaction({
            organizationId: body.organizationId,
            memberId: body.memberId, // Optional
            type: body.type || "INCOME",
            paymentMethod: body.paymentMethod || "CASH",
            date: body.date ? new Date(body.date) : new Date(),
            items: body.items,
        });

        return NextResponse.json(transaction, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
    }
}
