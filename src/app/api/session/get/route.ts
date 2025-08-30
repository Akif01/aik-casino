import { getSessionIdCookie } from "@/lib/CookieHelper";
import { generateNewSession } from "@/lib/SessionService";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const existingSessionId = await getSessionIdCookie(req);

    if (existingSessionId) {
        console.debug("api/session/get: sessionId exists:", existingSessionId);
        return NextResponse.json({});
    }

    const newSessionId = await generateNewSession();
    console.debug("api/session/get: sessionId does NOT exist, created a new one:", newSessionId);
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