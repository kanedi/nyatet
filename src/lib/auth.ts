import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");

export async function signJWT(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  return await verifyJWT(token);
}

export async function updateSession(request: NextRequest) {
  const token = request.cookies.get("session")?.value;
  if (!token) return;

  // Refresh logic if needed, for now just return response
  const response = NextResponse.next();
  response.cookies.set({
    name: "session",
    value: token,
    httpOnly: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
  return response;
}

export async function verifyAPIToken(request: NextRequest) {
  // 1. Check Authorization Header (Bearer Token) - for Mobile App / Postman
  const authHeader = request.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    return await verifyJWT(token);
  }

  // 2. Check Session Cookie - for simple Browser API calls
  const cookieToken = request.cookies.get("session")?.value;
  if (cookieToken) {
    return await verifyJWT(cookieToken);
  }

  return null;
}
