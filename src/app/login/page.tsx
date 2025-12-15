"use client";

import { useActionState } from "react";
import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const initialState = {
    message: "",
};

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, initialState);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        {state?.message && (
                            <p className="text-sm text-red-500">{state.message}</p>
                        )}
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm text-gray-500">
                        <p>Demo Accounts:</p>
                        <p>RT: rt@nyatet.com / password123</p>
                        <p>UMKM: toko@nyatet.com / password123</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
