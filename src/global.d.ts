export { };

type GameState = "waiting" | "playing" | "won" | "lost";

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
