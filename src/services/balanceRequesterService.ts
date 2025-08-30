import { safeFetch } from "./requesterHelper";

const getBlanaceEndpoint = "/api/balance/get";

export async function getBalance() {
    return safeFetch<{ balance: number }>(getBlanaceEndpoint, {
        method: "GET",
        credentials: "include",
    });
}