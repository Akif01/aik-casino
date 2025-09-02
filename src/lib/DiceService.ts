import { getBalanceBySession, updateBalanceBySession } from "./BalanceService";
import crypto from "crypto";
import { GameState } from "@/types/gameState";

export async function roll(
    sessionId: string,
    guessedDiceNumber: number,
    betAmount: number
): Promise<string | null> {

    const availableBalance = await getBalanceBySession(sessionId);

    if (availableBalance === undefined ||
        availableBalance === null ||
        betAmount < 0 ||
        availableBalance < betAmount)
        return null;

    if (guessedDiceNumber < 0 || guessedDiceNumber > 99)
        return null;

    const gameId = crypto.randomUUID();
    const rolledDiceNumber = crypto.randomInt(0, 101);

    // probability of winning
    const probability = (guessedDiceNumber + 1) / 101;
    const houseEdge = 0.99;

    // multiplier with house edge applied
    const multiplier = (1 / probability) * houseEdge;
    const gameState = rolledDiceNumber <= guessedDiceNumber ? GameState.Won : GameState.Lost;
    const cashout = gameState === GameState.Won ? betAmount * (multiplier - 1) : 0;

    await updateBalanceBySession(sessionId, gameState === GameState.Won ? cashout : -betAmount);

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
