import { NextResponse } from "next/server";
import activeGames from "@/lib/activeGames";
import { calculateMultiplier, calculateCashout } from "@/lib/minesMultiplier";

export async function POST(req: Request) {
    const { gameId, cell } = await req.json();
    const game = activeGames[gameId];

    if (!game) return NextResponse.json({ error: "Game not found" }, { status: 400 });

    if (game.state !== "playing") {
        return NextResponse.json(
            { error: "Game is already finished", state: game.state },
            { status: 400 }
        );
    }

    if (game.mines.has(cell)) {
        game.revealed.add(cell);
        game.state = "lost";
        return NextResponse.json({
            result: "mine",
            revealed: Array.from(game.revealed),
            state: game.state,
            multiplier: 0,
            cashout: 0,
            betAmount: game.betAmount,
        });
    }

    game.revealed.add(cell);

    const safeCells = game.size * game.size - game.mines.size;
    const revealedSafeCells = Array.from(game.revealed).filter(
        (i) => !game.mines.has(i)
    ).length;

    if (revealedSafeCells >= safeCells) {
        game.state = "won";
    }

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
