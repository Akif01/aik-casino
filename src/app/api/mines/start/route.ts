import { NextResponse } from "next/server";
import crypto from "crypto";
import activeGames from "@/lib/activeGames";

export async function POST(req: Request) {
    const { size = 5, mineCount = 5, betAmount = 0 } = await req.json();

    const gridSize = Math.min(Math.max(size, 5), 10);
    const minesToPlace = Math.min(mineCount, gridSize * gridSize - 1);

    const mines = new Set<number>();
    while (mines.size < minesToPlace) {
        mines.add(crypto.randomInt(0, gridSize * gridSize));
    }

    const gameId = crypto.randomUUID();
    activeGames[gameId] = {
        size: gridSize,
        mines,
        revealed: new Set(),
        state: "playing",
        betAmount
    };

    return NextResponse.json({
        gameId,
        size: gridSize,
        mineCount: minesToPlace,
        betAmount,
        state: "playing"
    });
}
