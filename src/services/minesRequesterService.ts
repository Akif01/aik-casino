import { GameState } from "@/types/gameState";
import { safeFetch } from "./requesterHelper";

const startEndpoint = "/api/mines/start";
const clickEndpoint = "/api/mines/click";
const cashoutEndpoint = "/api/mines/cashout";

export async function startMinesGame(
    sessionId: string,
    size: number,
    mineCount: number,
    betAmount: number
) {
    return safeFetch<{
        gameId: string,
        size: number,
        mineCount: number,
        betAmount: number,
        state: GameState,
        multiplier: number,
        cashout: number
    }>(startEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, size, mineCount, betAmount }),
    });
}

export async function cashoutMinesGame(sessionId: string, gameId: string) {
    return safeFetch<{ cashout: number, gameState: GameState }>(
        cashoutEndpoint,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId, gameId }),
        }
    );
}

export async function cellClickedMinesGame(sessionId: string, gameId: string, cellIndex: number) {
    return safeFetch<{
        revealed: number[];
        gameState: GameState;
        balance: number;
        multiplier: number;
        cashout: number;
        mines: number[];
    }>(clickEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, gameId, cellIndex }),
    });
}
