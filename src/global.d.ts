export { };
import type { GameState } from "./types/gameState";
declare global {
    var balances: Record<string, number>;

    var activeGames: Record<
        string,
        {
            size: number;
            mines: Set<number>;
            revealed: Set<number>;
            state: GameState;
            betAmount: number;
        }
    >;
}
