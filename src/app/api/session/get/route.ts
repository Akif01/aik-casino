import { getSessionIdCookie } from "@/lib/CookieHelper";
import { generateNewSession } from "@/lib/SessionService";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const existingSessionId = await getSessionIdCookie(req);

    if (existingSessionId)
        return NextResponse.json({});

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