import { NextResponse } from "next/server";

export async function getSessionIdCookie(req: Request): Promise<string | null> {
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = Object.fromEntries(cookieHeader.split("; ").map(c => c.split("=")));
    const sessionId = cookies["sessionId"];

    return sessionId;
}