import { fetchOrThrow } from "./requesterHelper";

const GET_BALANCE_URL = "/api/balance/get";

export async function getBalance() {
    return fetchOrThrow<{ balance: number }>(GET_BALANCE_URL, {
        method: "GET",
        credentials: "include",
    });
}