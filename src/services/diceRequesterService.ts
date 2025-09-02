import { GameState } from "@/types/gameState";
import { fetchOrThrow } from "./requesterHelper";

const ROLL_URL = "/api/dice/roll";

export async function roll(
    guessedDiceNumber: number,
    betAmount: number) {
    return fetchOrThrow<{
        gameId: string,
        betAmount: number,
        state: GameState,
        multiplier: number,
        cashout: number,
        rolledDiceNumber: number,
        guessedDiceNumber: number,
    }>(ROLL_URL, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ guessedDiceNumber, betAmount }),
    });
}