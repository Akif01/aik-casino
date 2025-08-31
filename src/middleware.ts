import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Skip middleware for session creation endpoint
    if (pathname === "/api/session/get") {
        return NextResponse.next();
    }

    const sessionId = req.cookies.get("sessionId")?.value;

    if (!sessionId) {
        return NextResponse.json(
            { error: "No session provided" },
            { status: 400 }
        );
    }

    // Forward the sessionId to API routes via request headers
    const res = NextResponse.next();
    res.headers.set("x-internal-session-id", sessionId);

    return res;
}

// Limit middleware only to API routes
export const config = {
    matcher: ["/api/:path*"],
};
