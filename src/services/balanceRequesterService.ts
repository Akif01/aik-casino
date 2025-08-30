import { safeFetch } from "./requesterHelper";

const getBlanaceEndpoint = "/api/balance/get";

export async function getBalance(sessionId: string) {
    return safeFetch<{ balance: number }>(getBlanaceEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId })
    });
}