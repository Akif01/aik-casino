import { GameState } from "@/types/gameState";

const startEndpoint = "/api/mines/start";
const clickEndpoint = "/api/mines/click";
const cashoutEndpoint = "/api/mines/cashout";

export async function startMinesGame(
    sessionId: string,
    size: number,
    mineCount: number,
    betAmount: number) {
    const res = await fetch(startEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, size, mineCount, betAmount }),
    });
    if (!res.ok) throw new Error("Failed to start game");
    return res.json() as Promise<{
        gameId: string,
        size: number,
        mineCount: number,
        betAmount: number,
        state: GameState,
        multiplier: number,
        cashout: number
    }>;
}

export async function cashoutMinesGame(sessionId: string, gameId: string)
    : Promise<{ cashout: number, gameState: GameState } | null> {
    const res = await fetch(cashoutEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, gameId }),
    });

    if (!res.ok) return null;
    return res.json() as Promise<{ cashout: number, gameState: GameState }>;
}

export async function cellClickedMinesGame(sessionId: string, gameId: string, cellIndex: number): Promise<{
    revealed: number[];
    gameState: GameState;
    balance: number;
    multiplier: number;
    cashout: number;
    mines: number[];
} | null> {
    const res = await fetch(clickEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, gameId, cellIndex }),
    });

    if (!res) return null;

    return res.json() as Promise<{
        revealed: number[];
        gameState: GameState;
        balance: number;
        multiplier: number;
        cashout: number;
        mines: number[];
    }>;
}
