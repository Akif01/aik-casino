import { NextResponse } from "next/server";
import { handleStartGame } from "@/lib/MinesService";
import { getSessionIdCookie } from "@/lib/CookieHelper";

export async function POST(req: Request) {
    const sessionId = await getSessionIdCookie(req);
    if (!sessionId) {
        return NextResponse.json(
            { error: "Session not provided" },
            { status: 400 }
        );
    }

    const { size = 5, mineCount = 5, betAmount = 0 } = await req.json();

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
