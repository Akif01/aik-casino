import { getBalanceBySession } from "@/lib/BalanceService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { sessionId } = await req.json();

    if (!sessionId)
        return NextResponse.json({ error: "No session provided" }, { status: 400 });

    const balance = await getBalanceBySession(sessionId);

    if (!balance) {
        return NextResponse.json({ error: "Could not get balance" }, { status: 400 });
    }

    return NextResponse.json({
        sessionId,
        balance: balance,
    });
}
