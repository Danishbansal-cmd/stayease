import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
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

    const decoded = verifyToken(token);

    if (!decoded) {
        return NextResponse.json(
            { status: "error", message: "Invalid token", data: null },
            { status: 401 }
        );
    }

    const role = decoded.role;

    // --- Role-Based Access Control (RBAC) ---

    // Listings: Only HOST and ADMIN can create, update, or delete listings
    if (pathname.startsWith("/api/listings") && method !== "GET") {
        if (role !== "HOST" && role !== "ADMIN") {
            return NextResponse.json(
                { status: "error", message: "Forbidden: Only hosts and admins can manage listings", data: null },
                { status: 403 }
            );
        }
    }

    // Bookings: Only GUEST and ADMIN can create bookings
    if (pathname.startsWith("/api/bookings") && method === "POST") {
        if (role !== "GUEST" && role !== "ADMIN") {
            return NextResponse.json(
                { status: "error", message: "Forbidden: Only guests can create bookings", data: null },
                { status: 403 }
            );
        }
    }

    // Reviews: Only GUEST and ADMIN can write reviews 
    if (pathname.startsWith("/api/review") && method === "POST") {
        if (role !== "GUEST" && role !== "ADMIN") {
            return NextResponse.json(
                { status: "error", message: "Forbidden: Only guests can create reviews", data: null },
                { status: 403 }
            );
        }
    }

    // attach the userId and role in request
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", decoded.userId);
    requestHeaders.set("x-user-role", role);

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

