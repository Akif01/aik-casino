import { updateBalanceBySession } from "@/lib/BalanceService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { sessionId, amount } = await req.json();

    if (!sessionId)
        return NextResponse.json({ error: "No session provided" }, { status: 400 });

    const balance = updateBalanceBySession(sessionId, amount);

    return NextResponse.json({
        sessionId,
        balance: balance,
    });
}