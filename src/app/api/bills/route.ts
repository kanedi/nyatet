import { NextRequest, NextResponse } from "next/server";
import { verifyAPIToken } from "@/lib/auth";
import { createNewBill, getBillList, updateExistingBillStatus } from "../../../services/bill";

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
        const bills = await getBillList(organizationId);
        return NextResponse.json(bills);
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

        // Handle STATUS update if 'id' and 'status' are present
        if (body.id && body.status) {
            const bill = await updateExistingBillStatus(body.id, body.status);
            return NextResponse.json(bill);
        }

        // Handle CREATE
        if (!body.organizationId || !body.memberId || !body.period || !body.amount) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (session.organizationId !== body.organizationId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const bill = await createNewBill({
            organizationId: body.organizationId,
            memberId: body.memberId,
            period: body.period,
            amount: Number(body.amount),
        });

        return NextResponse.json(bill, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
    }
}
