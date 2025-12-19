'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon } from "lucide-react";
import { sendMessageAction } from "@/actions/telegram";

export function SendMessageDialog({ chatName, chatId }: { chatName: string, chatId: string | null }) {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!chatId) return;
        setLoading(true);
        const res = await sendMessageAction(chatId, message);
        setLoading(false);

        if (res.success) {
            alert("Message sent!");
            setOpen(false);
            setMessage("");
        } else {
            alert("Failed: " + res.error);
        }
    };

    if (!chatId) return null; // Don't show button if no Telegram ID

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" title="Send Telegram Message">
                    <SendIcon className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Send Message to {chatName}</DialogTitle>
                    <DialogDescription>
                        Send a direct message via Telegram Bot.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="message" className="text-right">
                            content
                        </Label>
                        <Textarea
                            id="message"
                            value={message}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                            className="col-span-3 h-24"
                            placeholder="Type your message..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSend} disabled={loading || !message.trim()}>
                        {loading ? "Sending..." : "Send"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
