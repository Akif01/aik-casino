import { NextResponse } from "next/server";
import crypto from "crypto";

declare global {
    var balances: Record<string, number>;
}
global.balances ??= {};

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId || !global.balances[sessionId]) {
        // Create a new session
        const newSessionId = crypto.randomUUID();
        global.balances[newSessionId] = 10000; // starting balance
        return NextResponse.json({ sessionId: newSessionId, balance: 10000 });
    }

    return NextResponse.json({
        sessionId,
        balance: global.balances[sessionId],
    });
}
