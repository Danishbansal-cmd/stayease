import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const method = req.method;

    // Define Public Routes (e.g., fetching listings or reviews)
    const publicGetRoutes = ["/api/listings", "/api/review"];
    const isPublicGetRoute = method === "GET" && publicGetRoutes.some(route => pathname.startsWith(route));

    // Try to get token from Authorization header first, then from cookies
    const authHeader = req.headers.get("authorization");
    let token = authHeader?.split(" ")[1];

    if (!token) {
        token = req.cookies.get("accessToken")?.value || req.cookies.get("token")?.value;
    }

    if (!token) {
        if (isPublicGetRoute) {
            return NextResponse.next();
        }
        return NextResponse.json(
            { status: "error", message: "Unauthorized", data: null },
            { status: 401 }
        );
    }

    // attach the userId and role in request
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-access-token", token);

    return NextResponse.next({
        request: {
            headers: requestHeaders
        }
    });
}   

// Protect specific routes
export const config = {
  matcher: ["/api/listings/:path*", "/api/bookings/:path*", "/api/review/:path*"],
};

