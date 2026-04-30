import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export function middleware(req: NextRequest){
    // Try to get token from Authorization header first, then from cookies
    const authHeader = req.headers.get("authorization");
    let token = authHeader?.split(" ")[1];

    if (!token) {
        token = req.cookies.get("accessToken")?.value || req.cookies.get("token")?.value;
    }

    if(!token){
        return NextResponse.json(
            { status : "error", message : "Unauthorized", data : null},
            { status : 401}
        )
    }

    const decoded = verifyToken(token);

    if(!decoded){
        return NextResponse.json(
            { status : "error", message : "Invalid token", data : null},
            { status : 401 }
        )
    }

    // attach the userId in request
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", decoded.userId);

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

