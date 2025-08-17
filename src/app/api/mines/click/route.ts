import { getBalanceBySession } from "@/lib/BalanceService";
import { calculateCashout, calculateMultiplier } from "@/lib/MinesMultiplier";
import { handleCellClicked } from "@/lib/MinesService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { sessionId, gameId, cellIndex } = await req.json();

    const game = await handleCellClicked(sessionId, gameId, cellIndex);

    if (!game) {
        return NextResponse.json(
            { error: "Game not found or already finished" },
            { status: 400 }
        );
    }

    if (game.state === "lost") {
        return NextResponse.json({
            result: "mine",
            revealed: Array.from(game.revealed),
            state: game.state,
            multiplier: 0,
            cashout: 0,
            betAmount: game.betAmount,
        });
    }

    game.revealed.add(cellIndex);
    const revealedSafeCells = Array.from(game.revealed).filter(
        (i) => !game.mines.has(i)
    ).length;

    const multiplier = calculateMultiplier(game.size, game.mines.size, revealedSafeCells);
    const cashout = calculateCashout(game.betAmount, game.size, game.mines.size, revealedSafeCells);

    return NextResponse.json({
        result: "safe",
        revealed: Array.from(game.revealed),
        state: game.state,
        multiplier,
        cashout,
    });
}
