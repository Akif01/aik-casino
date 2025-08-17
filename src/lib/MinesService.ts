import { updateBalanceBySession } from "./BalanceService";
import crypto from "crypto";
import { calculateCashout } from "./MinesMultiplier";

export async function handleStartGame(size: number, mineCount: number, betAmount: number) {

    const gridSize = Math.min(Math.max(size, 5), 10);
    const minesToPlace = Math.min(mineCount, gridSize * gridSize - 1);

    const mines = new Set<number>();
    while (mines.size < minesToPlace) {
        mines.add(crypto.randomInt(0, gridSize * gridSize));
    }

    const gameId = crypto.randomUUID();

    activeGames[gameId] = {
        size: gridSize,
        mines: mines,
        revealed: new Set(),
        state: "playing",
        betAmount: betAmount
    };

    return gameId;
}

export async function handleCellClicked(sessionId: string, gameId: string, cellIndex: number) {
    const game = activeGames[gameId];

    if (!game)
        return;

    if (game.state !== "playing")
        return;

    if (game.mines.has(cellIndex)) {
        game.revealed.add(cellIndex);
        game.state = "lost";
        await updateBalanceBySession(sessionId, -game.betAmount);
        return game;
    }

    game.revealed.add(cellIndex);

    const safeCells = game.size * game.size - game.mines.size;
    const revealedSafeCells = Array.from(game.revealed).filter(
        (i) => !game.mines.has(i)
    ).length;

    if (revealedSafeCells >= safeCells) {
        game.state = "won";
    }

    return game;
}

export async function handleCashoutGame(sessionId: string, gameId: string) {
    const game = activeGames[gameId];

    if (!game || game.state !== "playing")
        return;

    const cashout = calculateCashout(
        game.betAmount,
        game.size,
        game.mines.size,
        game.revealed.size
    );

    await updateBalanceBySession(sessionId, cashout);
    game.state = "won";

    return cashout;
}