import { getBalanceBySession, topUpBalance } from "@/lib/BalanceService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const sessionId = req.headers.get("x-internal-session-id");
    const balance = await getBalanceBySession(sessionId!);

    if (balance === undefined || balance === null) {
        return NextResponse.json(
            { error: "Could not get balance" },
            { status: 404 });
    }

    const { amount } = await req.json();
    if (typeof amount !== "number" || amount <= 0) {
        return NextResponse.json(
            { error: "Invalid amount" },
            { status: 400 });
    }

    const newBalance = topUpBalance(sessionId!, amount);

    return Response.json({ newBalance }, { status: 200 });
}
