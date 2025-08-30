export async function getBalanceBySession(sessionId: string): Promise<number | null> {
    const balance = global.balances[sessionId];
    if (!balance) return null;

    return balance;
}

export async function updateBalanceBySession(sessionId: string, amount: number) {
    let balance = global.balances[sessionId];

    if (!balance) return null;

    balance += amount;
    global.balances[sessionId] = balance;

    return balance;
}

export async function initBalanceBySession(sessionId: string) {
    if (!(sessionId in global.balances)) {
        global.balances[sessionId] = 100;
        console.debug("initBalanceBySession: balance does not exist, creating one");
    }
    else
        console.debug("initBalanceBySession: balance exists");
}