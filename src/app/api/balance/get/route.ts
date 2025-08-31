import { getBalanceBySession } from "@/lib/BalanceService";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const sessionId = req.headers.get("x-internal-session-id");
    const balance = await getBalanceBySession(sessionId!);

    if (balance === undefined || balance === null) {
        return NextResponse.json(
            { error: "Could not get balance" },
            { status: 400 });
    }

    return NextResponse.json({
        balance,
    });
}
