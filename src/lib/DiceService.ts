import { tryUpdateBalance } from "./BalanceService";
import crypto from "crypto";
import { GameState } from "@/types/gameState";

export async function roll(
    sessionId: string,
    guessedDiceNumber: number,
    betAmount: number
): Promise<string | null> {
    if (betAmount < 0 || guessedDiceNumber < 0 || guessedDiceNumber > 99)
        return null;

    const gameId = crypto.randomUUID();
    const rolledDiceNumber = crypto.randomInt(0, 101);

    // probability of winning
    const probability = (guessedDiceNumber + 1) / 101;
    const houseEdge = 0.99;

    // multiplier with house edge applied (guarantee min 1.01x)
    const rawMultiplier = (1 / probability) * houseEdge;
    const multiplier = Math.max(rawMultiplier, 1.01);

    // determine win/loss
    const gameState =
        rolledDiceNumber <= guessedDiceNumber
            ? GameState.Won
            : GameState.Lost;

    let cashout = 0;
    if (gameState === GameState.Won && betAmount > 0) {
        cashout = betAmount * multiplier; // full payout on win
    }

    if (betAmount > 0) {
        const newBalance = await tryUpdateBalance(sessionId, betAmount, cashout);
        if (newBalance === null) {
            return null; // insufficient balance
        }
    }

    activeDiceGames[gameId] = {
        betAmount,
        guessedDiceNumber,
        rolledDiceNumber,
        state: gameState,
        cashout,
        multiplier,
    };

    return gameId;
}
