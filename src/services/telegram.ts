const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function sendTelegramMessage(chatId: string, text: string) {
    if (!BOT_TOKEN) {
        console.error("TELEGRAM_BOT_TOKEN is not defined");
        return { success: false, error: "Bot token not configured" };
    }

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: "Markdown"
            })
        });

        const data = await response.json();

        if (!data.ok) {
            console.error("Telegram API Error:", data);
            return { success: false, error: data.description };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Failed to send telegram message:", error);
        return { success: false, error: "Network error" };
    }
}
