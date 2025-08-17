import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const newSessionId = crypto.randomUUID();
    return NextResponse.json({ sessionId: newSessionId });
}