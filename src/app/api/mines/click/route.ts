import { handleCellClicked } from "@/lib/MinesService";
import { GameState } from "@/types/gameState";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const sessionId = req.headers.get("x-internal-session-id");
    const { gameId, cellIndex } = await req.json();
    const game = await handleCellClicked(sessionId!, gameId, cellIndex);

    if (!game) {
        return NextResponse.json(
            { error: "Game not found or already finished" },
            { status: 404 }
        );
    }

    if (game.state === GameState.Lost) {
        return NextResponse.json({
            revealed: Array.from(game.revealed),
            gameState: game.state,
            multiplier: 0,
            cashout: 0,
            betAmount: game.betAmount,
            mines: Array.from(game.mines),
        },
            { status: 200 });
    }

    return NextResponse.json({
        revealed: Array.from(game.revealed),
        gameState: game.state,
    },
        { status: 200 });
}
