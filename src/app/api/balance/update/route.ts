import { NextResponse } from "next/server";

declare global {
    var balances: Record<string, number>;
}
global.balances ??= {};

export async function POST(req: Request) {
    const { sessionId, change = 0 } = await req.json();

    if (!sessionId || global.balances[sessionId] == null) {
        return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }

    global.balances[sessionId] += change;

    return NextResponse.json({
        sessionId,
        balance: global.balances[sessionId],
    });
}
