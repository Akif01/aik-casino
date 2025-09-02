import { fetchOrThrow } from "./requesterHelper";

const SESSION_URL = "/api/session/get";

export async function initSession() {
    return fetchOrThrow<{}>(SESSION_URL, {
        method: "GET",
        credentials: "include",
    });
}