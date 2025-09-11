export function initGlobals() {
    if (!global.balances) global.balances = {};
    if (!global.minesGames) global.minesGames = {};
    if (!global.diceGames) global.diceGames = {};
}