export async function getBalanceBySession(sessionId: string): Promise<number | null> {
    let balance = global.balances[sessionId];

    if (!balance) {
        balance = 100;
        global.balances[sessionId] = balance;
    }

    return balance;
}

export async function updateBalanceBySession(sessionId: string, amount: number) {
    global.balances[sessionId] += amount;
    return global.balances[sessionId];
}