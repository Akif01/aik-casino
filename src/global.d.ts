export { };

declare global {
    type GameState = "waiting" | "playing" | "lost" | "won";
}

declare global {
    var balances: Record<string, number>;
}

declare global {
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
