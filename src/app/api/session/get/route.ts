import { initBalanceBySession } from "@/lib/BalanceService";
import { generateNewSession } from "@/lib/SessionService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const existingSessionId = req.cookies.get("sessionId")?.value;

    if (existingSessionId) {
        initBalanceBySession(existingSessionId);
        return NextResponse.json({});
    }

    const newSessionId = await generateNewSession();
    const response = NextResponse.json({});
    response.cookies.set({
        name: "sessionId",
        value: newSessionId,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
    });

    return response;
}