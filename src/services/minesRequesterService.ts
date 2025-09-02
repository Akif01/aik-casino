import { GameState } from "@/types/gameState";
import { fetchOrThrow } from "./requesterHelper";

const START_URL = "/api/mines/start";
const CLICK_URL = "/api/mines/click";
const CASHOUT_URL = "/api/mines/cashout";

export async function startMinesGame(
    size: number,
    mineCount: number,
    betAmount: number
) {
    return fetchOrThrow<{
        gameId: string,
        size: number,
        mineCount: number,
        betAmount: number,
        state: GameState,
        multiplier: number,
        cashout: number
    }>(START_URL, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ size, mineCount, betAmount }),
    });
}

export async function cashoutMinesGame(gameId: string) {
    return fetchOrThrow<{ cashout: number, gameState: GameState }>(
        CASHOUT_URL,
        {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gameId }),
        }
    );
}

export async function cellClickedMinesGame(gameId: string, cellIndex: number) {
    return fetchOrThrow<{
        revealed: number[];
        gameState: GameState;
        balance: number;
        multiplier: number;
        cashout: number;
        mines: number[];
    }>(CLICK_URL, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, cellIndex }),
    });
}
