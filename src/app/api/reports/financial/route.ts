import { NextRequest, NextResponse } from "next/server";
import { verifyAPIToken } from "@/lib/auth";
import { getFinancialSummaryData } from "../../../../services/report";

export async function GET(request: NextRequest) {
    const session = await verifyAPIToken(request);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const organizationId = searchParams.get("organizationId");
    const period = searchParams.get("period") as "day" | "month" || "day";
    const dateStr = searchParams.get("date");
    const date = dateStr ? new Date(dateStr) : new Date();

    if (!organizationId) {
        return NextResponse.json({ error: "Organization ID is required" }, { status: 400 });
    }

    if (session.organizationId !== organizationId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const summary = await getFinancialSummaryData(organizationId, period, date);
        return NextResponse.json(summary);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
