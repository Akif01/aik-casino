import { getBalanceBySession, updateBalanceBySession } from "./BalanceService";
import crypto from "crypto";
import { GameState } from "@/types/gameState";

export async function handleStartGame(
    sessionId: string,
    gridSize: number,
    mineCount: number,
    betAmount: number): Promise<string | null> {
    const availableBalance = await getBalanceBySession(sessionId);

    if (!availableBalance || betAmount <= 0 || availableBalance < betAmount)
        return null;

    if (gridSize < 5 || gridSize > 10)
        return null;

    if (mineCount < 1 || mineCount > gridSize - 1)
        return null;

    const mines = new Set<number>();
    while (mines.size < mineCount) {
        mines.add(crypto.randomInt(0, gridSize * gridSize));
    }

    // find safe spots
    const safeSpots: number[] = [];
    for (let i = 0; i < gridSize * gridSize; i++) {
        if (!mines.has(i)) {
            safeSpots.push(i);
        }
    }

    console.log("Safe spots at:", safeSpots);
    console.log("Mine spots at:", [...mines]);

    const gameId = crypto.randomUUID();

    activeGames[gameId] = {
        size: gridSize,
        mines: mines,
        revealed: new Set(),
        state: GameState.Playing,
        betAmount: betAmount
    };

    return gameId;
}

export async function handleCellClicked(sessionId: string, gameId: string, cellIndex: number) {
    const game = activeGames[gameId];

    if (!game)
        return;

    if (game.state !== GameState.Playing)
        return;

    if (game.mines.has(cellIndex)) {
        game.revealed.add(cellIndex);
        game.state = GameState.Lost;
        await updateBalanceBySession(sessionId, -game.betAmount);
        return game;
    }

    game.revealed.add(cellIndex);

    const safeCells = game.size * game.size - game.mines.size;
    const revealedSafeCells = Array.from(game.revealed).filter(
        (i) => !game.mines.has(i)
    ).length;

    if (revealedSafeCells >= safeCells) {
        await handleCashoutGame(sessionId, gameId);
        game.state = GameState.Won;
    }

    return game;
}

export async function handleCashoutGame(sessionId: string, gameId: string)
    : Promise<{ cashout: number, gameState: GameState } | null> {
    if (!sessionId || !gameId) {
        return null;
    }

    const game = activeGames[gameId];

    if (!game || game.state !== GameState.Playing)
        return null;

    const availableBalance = await getBalanceBySession(sessionId);

    if (!availableBalance || availableBalance < game.betAmount)
        return null;

    const cashout = calculateCashout(
        game.betAmount,
        game.size,
        game.mines.size,
        game.revealed.size
    );

    await updateBalanceBySession(sessionId, cashout);
    game.state = GameState.Won;

    return {
        cashout,
        gameState: game.state
    };
}

export function calculateMultiplier(gridSize: number, mineCount: number, revealedSafeCells: number) {
    const totalCells = gridSize * gridSize;
    const safeCells = totalCells - mineCount;

    if (safeCells <= 0) return 0;

    // Base growth depends on mine density
    const baseGrowth = 1 + (mineCount / totalCells) * 2;

    // Exponential growth with diminishing returns
    const multiplier = Math.pow(baseGrowth, revealedSafeCells / 2);

    return parseFloat(multiplier.toFixed(2));
}

export function calculateCashout(
    betAmount: number,
    gridSize: number,
    mines: number,
    revealedSafeCells: number
): number {
    if (betAmount < 1) return 0;
    const multiplier = calculateMultiplier(gridSize, mines, revealedSafeCells);
    return Number((betAmount * (multiplier - 1)).toFixed(2));
}
