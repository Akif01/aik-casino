export async function getBalanceBySession(sessionId: string): Promise<number | null> {
    const balance = global.balances[sessionId];
    if (balance === undefined || balance === null) return null;

    return balance;
}

export async function updateBalanceBySession(sessionId: string, amount: number) {
    let balance = global.balances[sessionId];
    if (balance === undefined || balance === null) return null;

    balance += amount;
    global.balances[sessionId] = balance;

    return balance;
}

export async function initBalanceBySession(sessionId: string) {
    if (!(sessionId in global.balances)) {
        global.balances[sessionId] = 100;
    }
}