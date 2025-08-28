export function initGlobals() {
    if (!global.balances) global.balances = {};
    if (!global.activeMinesGames) global.activeMinesGames = {};
    if (!global.activeDiceGames) global.activeDiceGames = {};
}