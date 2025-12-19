'use server';

import { sendTelegramMessage } from "@/services/telegram";
import { revalidatePath } from "next/cache";

export async function sendMessageAction(chatId: string, message: string) {
    if (!chatId) {
        return { success: false, error: "Chat ID is missing" };
    }
    if (!message.trim()) {
        return { success: false, error: "Message content is empty" };
    }

    try {
        const result = await sendTelegramMessage(chatId, message);

        if (result.success) {
            return { success: true, message: "Message sent successfully" };
        } else {
            return { success: false, error: result.error || "Failed to send message" };
        }
    } catch (error) {
        console.error("Action Error:", error);
        return { success: false, error: "Internal server error" };
    }
}
