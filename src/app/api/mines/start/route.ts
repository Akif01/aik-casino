import { NextResponse } from "next/server";
import { handleStartGame } from "@/lib/MinesService";

export async function POST(req: Request) {
    const { size = 5, mineCount = 5, betAmount = 0 } = await req.json();

    const gameId = await handleStartGame(size, mineCount, betAmount);
    const game = activeGames[gameId];

    return NextResponse.json({
        gameId,
        size: game.size,
        mineCount: game.mines.size,
        betAmount,
        state: "playing",
        multiplier: 0,
        cashout: 0,
    });
}
