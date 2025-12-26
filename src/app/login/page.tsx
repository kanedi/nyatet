"use client";

import { useActionState } from "react";
import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { NotebookPen, Heart } from "lucide-react";

// ... existing code ...

const initialState = {
    message: "",
};

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, initialState);

    return (
        <div className="flex min-h-screen flex-col items-center justify-between bg-slate-950 p-4">
            <div className="flex-1 flex items-center justify-center w-full">
                <Card className="w-full max-w-sm bg-blue-50 border-blue-100 shadow-xl">
                    <CardHeader className="text-center space-y-4 pt-8">
                        <div className="flex justify-center">
                            <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300">
                                <NotebookPen className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">LOGIN</CardTitle>
                            <CardDescription className="text-slate-500">
                                Welcome back! Please enter your details.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form action={formAction} className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    className="bg-white border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="bg-white border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            {state?.message && (
                                <p className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200 text-center font-medium">{state.message}</p>
                            )}
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 shadow-md hover:shadow-lg transition-all" disabled={isPending}>
                                {isPending ? "Signing in..." : "Sign in"}
                            </Button>
                        </form>
                        <div className="mt-6 pt-6 border-t border-blue-100 text-center text-xs text-slate-400 space-y-1">
                            <p className="font-semibold text-slate-500 mb-2">DEMO ACCOUNTS</p>
                            <p>RT: rt@nyatet.com / password123</p>
                            <p>UMKM: toko@nyatet.com / password123</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <footer className="mt-8 text-center text-sm text-slate-600 flex items-center justify-center gap-1">
                crafted with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> by fliptech
            </footer>
        </div>
    );
}
