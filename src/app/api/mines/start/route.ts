import { NextResponse } from "next/server";
import { handleStartGame } from "@/lib/MinesService";

export async function POST(req: Request) {
    const { sessionId, size = 5, mineCount = 5, betAmount = 0 } = await req.json();

    const gameId = await handleStartGame(sessionId, size, mineCount, betAmount);
    if (!gameId) {

        return NextResponse.json(
            { error: "Game could not be created" },
            { status: 400 }
        );
    }

    const game = activeMinesGames[gameId];

    return NextResponse.json({
        gameId,
        size: game.size,
        mineCount: game.mines.size,
        betAmount,
        state: game.state,
        multiplier: 0,
        cashout: 0,
    });
}
