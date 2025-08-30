import { getSessionIdCookie } from "@/lib/CookieHelper";
import { calculateCashout, calculateMultiplier, handleCellClicked } from "@/lib/MinesService";
import { GameState } from "@/types/gameState";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const sessionId = await getSessionIdCookie(req);
    if (!sessionId) {
        return NextResponse.json(
            { error: "Session not provided" },
            { status: 400 }
        );
    }

    const { gameId, cellIndex } = await req.json();
    const game = await handleCellClicked(sessionId, gameId, cellIndex);

    if (!game) {
        return NextResponse.json(
            { error: "Game not found or already finished" },
            { status: 400 }
        );
    }

    if (game.state === GameState.Lost) {
        return NextResponse.json({
            result: "mine",
            revealed: Array.from(game.revealed),
            gameState: game.state,
            multiplier: 0,
            cashout: 0,
            betAmount: game.betAmount,
            mines: Array.from(game.mines),
        });
    }

    const multiplier = calculateMultiplier(game.size, game.mines.size, game.revealed.size);
    const cashout = calculateCashout(game.betAmount, game.size, game.mines.size, game.revealed.size);

    return NextResponse.json({
        result: "safe",
        revealed: Array.from(game.revealed),
        gameState: game.state,
        multiplier,
        cashout,
    });
}
