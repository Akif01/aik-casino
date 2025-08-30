export async function initSession() {
    const url = "/api/session/get";

    const res = await fetch(url, {
        method: "GET",
        credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to get sessionId");
}