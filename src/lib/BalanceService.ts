export async function getBalanceBySession(sessionId: string): Promise<number | null> {
    const balance = global.balances[sessionId];
    if (balance === undefined || balance === null) return null;

    return balance;
}

export async function initBalanceBySession(sessionId: string) {
    if (!(sessionId in global.balances)) {
        global.balances[sessionId] = 100;
    }
}

export async function tryUpdateBalance(
    sessionId: string,
    betAmount: number,
    cashout: number
): Promise<number | null> {
    const current = global.balances[sessionId] ?? 0;

    if (current < betAmount) {
        return null;
    }

    let newBalance = cashout === 0 ? current - betAmount : current;

    newBalance += cashout;
    global.balances[sessionId] = newBalance;

    return newBalance;
}