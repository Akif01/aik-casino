import { GameState } from "@/types/gameState";
import { safeFetch } from "./requesterHelper";

const startEndpoint = "/api/mines/start";
const clickEndpoint = "/api/mines/click";
const cashoutEndpoint = "/api/mines/cashout";

export async function startMinesGame(
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
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ size, mineCount, betAmount }),
    });
}

export async function cashoutMinesGame(gameId: string) {
    return safeFetch<{ cashout: number, gameState: GameState }>(
        cashoutEndpoint,
        {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gameId }),
        }
    );
}

export async function cellClickedMinesGame(gameId: string, cellIndex: number) {
    return safeFetch<{
        revealed: number[];
        gameState: GameState;
        balance: number;
        multiplier: number;
        cashout: number;
        mines: number[];
    }>(clickEndpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, cellIndex }),
    });
}
