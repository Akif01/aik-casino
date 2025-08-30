import { getBalanceBySession } from "@/lib/BalanceService";
import { getSessionIdCookie } from "@/lib/CookieHelper";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const sessionId = await getSessionIdCookie(req);

    if (!sessionId) {
        return NextResponse.json({ error: "No session provided" }, { status: 400 });
    }

    const balance = await getBalanceBySession(sessionId);

    if (!balance) {
        return NextResponse.json({ error: "Could not get balance" }, { status: 400 });
    }

    return NextResponse.json({
        balance,
    });
}
