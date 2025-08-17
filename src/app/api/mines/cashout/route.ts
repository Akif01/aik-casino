import { handleCashoutGame } from "@/lib/MinesService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { sessionId, gameId } = await req.json();

    if (!sessionId) {
        return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }

    const cashout = await handleCashoutGame(sessionId, gameId);
    const game = activeGames[gameId];

    return NextResponse.json({
        cashout: cashout,
        state: game.state
    });
}
