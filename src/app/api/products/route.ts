import { NextRequest, NextResponse } from "next/server";
import { createNewProduct, getProductList } from "../../../services/product";
import { verifyAPIToken } from "@/lib/auth";

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

    // Optional: Verify organization access
    if (session.organizationId !== organizationId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const products = await getProductList(organizationId);
        return NextResponse.json(products);
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

        // Basic validation
        if (!body.organizationId || !body.name || !body.price || !body.unit) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Optional: Verify organization access
        if (session.organizationId !== body.organizationId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const product = await createNewProduct({
            organizationId: body.organizationId,
            name: body.name,
            price: Number(body.price),
            unit: body.unit,
            isService: body.isService || false,
            costPrice: Number(body.costPrice),
            stock: Number(body.stock),
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
    }
}
