export { };
import type { GameState } from "./types/gameState";
import type { MinesGame } from "./types/minesGame"

declare global {
    var balances: Record<string, number>;
    var activeMinesGames: Record<string, MinesGame>;
}
