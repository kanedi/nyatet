import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getFinancialSummaryData } from "@/services/report";
import { formatFinancialReportMessage } from "@/services/format-report";
import { sendTelegramMessage } from "@/services/telegram";

export async function GET(request: Request) {
    // SECURITY: Verify a CRON_SECRET if deployed, but for now we'll leave it open or check basic header
    // const authHeader = request.headers.get("authorization");
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        console.log("Starting Daily Report Cron...");

        // 1. Find all users with Telegram Chat ID
        const users = await prisma.user.findMany({
            where: {
                telegramChatId: { not: null },
                role: { in: ['ADMIN', 'SUPER_ADMIN'] } // Only admins get reports
            },
            include: { organization: true }
        });

        const results = [];

        for (const user of users) {
            if (!user.telegramChatId) continue;

            const orgId = user.organizationId;
            const orgName = user.organization.name;
            const today = new Date();

            // 2. Generate Report Data
            const summary = await getFinancialSummaryData(orgId, "day", today);

            // 3. Format Message
            const message = formatFinancialReportMessage(orgName, summary, "Harian");

            // 4. Send Message
            const sendRes = await sendTelegramMessage(user.telegramChatId, message);
            results.push({ email: user.email, success: sendRes.success, error: sendRes.error });
        }

        return NextResponse.json({ success: true, processed: results.length, details: results });
    } catch (error) {
        console.error("Cron Error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
