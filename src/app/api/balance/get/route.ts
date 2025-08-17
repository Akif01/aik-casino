import { NextResponse } from "next/server";
import crypto from "crypto";

declare global {
    var balances: Record<string, number>;
}
global.balances ??= {};

export async function POST(req: Request) {
    const sessionId = await req.json();

    if (!sessionId)
        return NextResponse.json({ error: "No session provided" }, { status: 400 });

    if (!global.balances[sessionId]) {
        global.balances[sessionId] = 10000; // starting balance
        return NextResponse.json({ sessionId: sessionId, balance: 10000 });
    }

    return NextResponse.json({
        sessionId,
        balance: global.balances[sessionId],
    });
}
