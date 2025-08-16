import { NextResponse } from "next/server";

declare global {
    var activeGames: Record<string, { mines: Set<number>; revealed: Set<number> }>;
}
global.activeGames ??= {};

export async function POST(req: Request) {
    const { gameId, cell } = await req.json();
    const game = global.activeGames[gameId];
    if (!game) return NextResponse.json({ error: "Game not found" }, { status: 400 });

    if (game.mines.has(cell)) {
        return NextResponse.json({ result: "mine", gameOver: true });
    }

    game.revealed.add(cell);
    const safeTiles = 25 - game.mines.size;
    const hasWon = game.revealed.size >= safeTiles;

    return NextResponse.json({
        result: "safe",
        revealed: Array.from(game.revealed),
        hasWon,
    });
}
