import { getSessionIdCookie } from "@/lib/CookieHelper";
import { roll } from "@/lib/DiceService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const sessionId = await getSessionIdCookie(req);

    if (!sessionId) {
        return NextResponse.json(
            { error: "Session not provided" },
            { status: 400 }
        );
    }

    const { guessedDiceNumber, betAmount = 0 } = await req.json();
    const gameId = await roll(sessionId, guessedDiceNumber, betAmount);

    if (!gameId) {
        return NextResponse.json(
            { error: "Game could not be created" },
            { status: 400 }
        );
    }

    const game = activeDiceGames[gameId];
    return NextResponse.json({
        gameId,
        betAmount,
        state: game.state,
        rolledDiceNumber: game.rolledDiceNumber,
        guessedDiceNumber: game.guessedDiceNumber,
        multiplier: game.multiplier,
        cashout: game.cashout,
    });
}