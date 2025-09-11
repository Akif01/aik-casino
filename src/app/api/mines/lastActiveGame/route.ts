import { getLastActiveMinesGameEntry } from "@/lib/MinesService";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const sessionId = req.headers.get("x-internal-session-id");
    const result = await getLastActiveMinesGameEntry(sessionId!);

    if (!result) {
        return NextResponse.json(
            { error: "No active mines game" },
            { status: 404 });
    }

    const gameId = result[0];
    const minesGame = result[1];

    return NextResponse.json({
        sessionId: minesGame.sessionId,
        gameId: gameId,
        size: minesGame.size,
        mineCount: minesGame.mines.size,
        revealed: Array.from(minesGame.revealed),
        betAmount: minesGame.betAmount,
        state: minesGame.state,
    });
}