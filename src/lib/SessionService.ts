import { initBalanceBySession } from "./BalanceService";
import crypto from "crypto";

export async function generateNewSession(): Promise<string> {
    const newSessionId = crypto.randomUUID();
    initBalanceBySession(newSessionId);

    return newSessionId;
}