export async function getBalance(sessionId?: string) {
    const url = sessionId
        ? `/api/balance/get?sessionId=${sessionId}`
        : `/api/balance/get`;

    const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to fetch balance");
    return res.json() as Promise<{ sessionId: string; balance: number }>;
}

export async function updateBalance(sessionId: string, change: number) {
    const res = await fetch("/api/balance/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, change }),
    });

    if (!res.ok) throw new Error("Failed to update balance");
    return res.json() as Promise<{ sessionId: string; balance: number }>;
}
