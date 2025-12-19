import { FinancialSummary } from "./report";

export function formatFinancialReportMessage(orgName: string, summary: FinancialSummary, periodStr: string) {
    return `
*Laporan Keuangan ${periodStr} - ${orgName}*
📅 ${new Date().toLocaleDateString()}

*Ringkasan:*
📈 Pendapatan: Rp ${summary.revenue.toLocaleString()}
📉 Pengeluaran: Rp ${summary.cost.toLocaleString()}
💰 Profit: Rp ${summary.profit.toLocaleString()}

*Aktivitas:*
🔢 Jumlah Transaksi: ${summary.transactionCount}

_Dikirim otomatis oleh Nyatet Bot_
    `.trim();
}
