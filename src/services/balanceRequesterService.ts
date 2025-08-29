import { safeFetch } from "./requesterHelper";

const getBlanaceEndpoint = "/api/balance/get";
const updateBalanceEndpoint = "/api/balance/update";

export async function getBalance(sessionId: string) {
    return safeFetch<{ sessionId: string; balance: number }>(getBlanaceEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId })
    });
}

export async function updateBalance(sessionId: string, amount: number) {
    return safeFetch<{ sessionId: string; balance: number }>(updateBalanceEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, amount })
    });
}