import { generateNewSession } from "@/lib/SessionService";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const newSessionId = await generateNewSession();
    return NextResponse.json({ sessionId: newSessionId });
}