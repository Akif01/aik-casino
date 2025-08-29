export async function getBalanceBySession(sessionId: string): Promise<number | null> {
    let balance = global.balances[sessionId];

    if (!balance) {
        balance = 100;
        global.balances[sessionId] = balance;
    }

    return balance;
}

export async function updateBalanceBySession(sessionId: string, amount: number) {
    let balance = global.balances[sessionId];

    if (!balance)
        return null;

    balance += amount;
    global.balances[sessionId] = balance;

    return balance;
}