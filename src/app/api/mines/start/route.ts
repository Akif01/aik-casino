import { NextResponse } from "next/server";
import crypto from "crypto";

declare global {
    var activeGames: Record<string, { mines: Set<number>; revealed: Set<number> }>;
}
global.activeGames ??= {};

export async function POST(req: Request) {
    const { size = 5, mineCount = 5 } = await req.json();

    const mines = new Set<number>();
    while (mines.size < mineCount) {
        mines.add(crypto.randomInt(0, size * size));
    }

    const gameId = crypto.randomUUID();
    global.activeGames[gameId] = { mines, revealed: new Set() };

    return NextResponse.json({ gameId, size, mineCount });
}
