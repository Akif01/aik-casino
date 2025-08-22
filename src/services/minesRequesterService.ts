const startEndpoint = "/api/mines/start";
const clickEndpoint = "/api/mines/click";
const cashoutEndpoint = "/api/mines/cashout";

export async function startMinesGame(
    sessionId: string,
    size: number,
    mineCount: number,
    betAmount: number) {
    const res = await fetch(startEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, size, mineCount, betAmount }),
    });
    if (!res.ok) throw new Error("Failed to start game");
    return res.json() as Promise<{
        gameId: string,
        size: number,
        mineCount: number,
        betAmount: number,
        state: GameState,
        multiplier: number,
        cashout: number
    }>;
}

export async function cashoutMinesGame(sessionId: string, gameId: string) {
    const res = await fetch(cashoutEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, gameId }),
    });

    if (!res.ok) throw new Error("Failed to update balance");
    return res.json() as Promise<{ cashout: number, state: GameState }>;
}

export async function cellClickedMinesGame(sessionId: string, gameId: string, cellIndex: number): Promise<{
    revealed: number[];
    state: GameState;
    balance: number;
    multiplier: number;
    cashout: number;
}> {
    const res = await fetch(clickEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, gameId, cellIndex }),
    });

    const resObj = (await res.json()) as {
        revealed: number[];
        state: GameState;
        balance: number;
        multiplier: number;
        cashout: number;
    };

    return resObj;
}
