import { GameState } from "@/types/gameState";

const rollEndpoint = "/api/dice/roll";

export async function roll(
    sessionId: string,
    guessedDiceNumber: number,
    betAmount: number) {
    const res = await fetch(rollEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, guessedDiceNumber, betAmount }),
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