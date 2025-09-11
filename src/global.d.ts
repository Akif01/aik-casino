export { };
import { DiceGame } from "./types/diceGame";
import type { GameState } from "./types/gameState";
import type { MinesGame } from "./types/minesGame"

declare global {
    var balances: Record<string, number>;
    var minesGames: Record<string, MinesGame>;
    var diceGames: Record<string, DiceGame>;
}
