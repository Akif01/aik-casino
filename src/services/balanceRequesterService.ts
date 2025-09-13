import { fetchOrThrow } from "./requesterHelper";

const GET_BALANCE_URL = "/api/balance/get";
const TOP_UP_BALANCE_URL = "/api/balance/post";

export async function getBalance() {
    return fetchOrThrow<{ balance: number }>(GET_BALANCE_URL, {
        method: "GET",
        credentials: "include",
    });
}

export async function topUpBalance(amount: number) {
    return fetchOrThrow<{ balance: number }>(TOP_UP_BALANCE_URL, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
    });
}