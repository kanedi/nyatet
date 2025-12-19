'use server';

import { getFinancialSummaryData } from "@/services/report";
import { formatFinancialReportMessage } from "@/services/format-report";
import { sendTelegramMessage } from "@/services/telegram";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function sendReportAction(period: "day" | "month") {
    try {
        // 1. Get Session
        const session = await getSession();
        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        // 2. Fetch User to get latest Telegram ID & Org Name
        // Payload might use 'userId' or 'id' depending on where it was signed
        const userId = (session.userId || session.id) as string;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { organization: true }
        });

        if (!user || user.organizationId !== session.organizationId) {
            return { success: false, error: "User not found or mismatch" };
        }

        if (!user.telegramChatId) {
            return { success: false, error: "Telegram ID not connected. Please setup in Settings." };
        }

        const orgId = user.organizationId;
        const orgName = user.organization.name;
        const today = new Date();

        // 3. Generate Report
        const summary = await getFinancialSummaryData(orgId, period, today);

        // 4. Format Message
        const periodStr = period === "day" ? "Harian" : "Bulanan";
        const message = formatFinancialReportMessage(orgName, summary, periodStr);

        // 5. Send
        const result = await sendTelegramMessage(user.telegramChatId, message);

        if (result.success) {
            return { success: true, message: `Laporan ${periodStr} dikirim ke Telegram!` };
        } else {
            return { success: false, error: result.error || "Failed to send report" };
        }

    } catch (error) {
        console.error("Send Report Action Error:", error);
        return { success: false, error: "Internal server error" };
    }
}
