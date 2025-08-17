export function calculateMultiplier(gridSize: number, mineCount: number, revealedSafeCells: number) {
    const totalCells = gridSize * gridSize;
    const safeCells = totalCells - mineCount;
    if (safeCells <= 0) return 0;

    // Base growth per safe click
    const baseGrowth = 1 + (mineCount / totalCells); // slightly higher reward for more mines

    // Use linear progression instead of full exponent
    const multiplier = 1 + revealedSafeCells * (baseGrowth - 1);

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
