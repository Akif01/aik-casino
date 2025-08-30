import { GameState } from "@/types/gameState";

const rollEndpoint = "/api/dice/roll";

export async function roll(
    guessedDiceNumber: number,
    betAmount: number) {
    const res = await fetch(rollEndpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guessedDiceNumber, betAmount }),
    });

    if (!res.ok) throw new Error("Failed to roll dice");

    return res.json() as Promise<{
        gameId: string,
        betAmount: number,
        state: GameState,
        multiplier: number,
        cashout: number,
        rolledDiceNumber: number,
        guessedDiceNumber: number,
    }>;
}