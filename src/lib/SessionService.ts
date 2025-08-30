import { initBalanceBySession } from "./BalanceService";
import crypto from "crypto";

export async function generateNewSession(): Promise<string> {
    const newSessionId = crypto.randomUUID();
    console.debug("generateNewSession:", newSessionId);
    initBalanceBySession(newSessionId);

    return newSessionId;
}