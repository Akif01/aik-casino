export async function getSessionId() {
    const url = "/api/session/get";

    const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to get sessionId");
    return res.json() as Promise<{ sessionId: string; }>;
}