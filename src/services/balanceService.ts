export async function getBalance(sessionId: string) {
    const url = "/api/balance/get";

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId })
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
