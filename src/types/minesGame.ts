import { GameState } from "./gameState";

export type MinesGame = {
    size: number;
    mines: Set<number>;
    revealed: Set<number>;
    state: GameState;
    betAmount: number;
};