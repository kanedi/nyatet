import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession, verifyJWT } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    // Update session expiration if valid
    await updateSession(request);

    const token = request.cookies.get("session")?.value;
    const { pathname } = request.nextUrl;

    // Protect /dashboard
    if (pathname.startsWith("/dashboard")) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        const payload = await verifyJWT(token);
        if (!payload) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // Redirect / to /dashboard if logged in
    if (pathname === "/" && token) { // Simple check, ideally verify
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
