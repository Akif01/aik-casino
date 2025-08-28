import { GameState } from "./gameState";

export type DiceGame = {
    guessedDiceNumber: number;
    rolledDiceNumber: number | null;
    state: GameState;
    betAmount: number;
    multiplier: number;
    cashout: number,
};