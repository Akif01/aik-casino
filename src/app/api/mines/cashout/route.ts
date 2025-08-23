import { handleCashoutGame } from "@/lib/MinesService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { sessionId, gameId } = await req.json();
    const result = await handleCashoutGame(sessionId, gameId);
    if (!result) {
        return NextResponse.json({ error: "Could not cashout game" }, { status: 400 });
    }

    return NextResponse.json({
        cashout: result.cashout,
        gameState: result.gameState
    });
}
