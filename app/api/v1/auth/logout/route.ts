import { successResponse, errorResponse } from "@/lib/api-response";
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        // Get the refresh token from the cookie 
        const cookieHeader = req.headers.get("cookie");
        const refreshToken = cookieHeader?.split("; ").find(c => c.startsWith("refreshToken="))?.split("=")[1];

        // If it exists, delete it from the database
        if (refreshToken) {
            // We use deleteMany instead of delete so it doesn't throw an error 
            // if the token was already deleted somehow.
            await prisma.refreshToken.deleteMany({
                where: { token: refreshToken }
            });
        }

        const res = successResponse("Logged out successfully");

        // Tell the browser to instantly delete the access token
        res.headers.append(
            "Set-Cookie",
            `accessToken=; Path=/; Max-Age=0; SameSite=Strict; ${
                process.env.NODE_ENV === "production" ? "Secure" : ""
            }`
        );

        // Tell the browser to instantly delete the refresh token
        res.headers.append(
            "Set-Cookie",
            `refreshToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict; ${
                process.env.NODE_ENV === "production" ? "Secure" : ""
            }`
        );

        return res;
    } catch (error) {
        console.error(error);
        return errorResponse("Something went wrong", 500);
    }
}