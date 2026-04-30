import { prisma } from '@/lib/prisma';
import { errorResponse, successResponse } from '@/lib/api-response';
import { signInToken, generateRefreshToken } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        // Read the refresh token from the cookie
        const cookieHeader = req.headers.get("cookie");
        const refreshToken = cookieHeader?.split("; ").find(c => c.startsWith("refreshToken="))?.split("=")[1];

        if (!refreshToken) {
            return errorResponse("No refresh token provided", 401);
        }

        // Find the refresh token in the database
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken }
        });

        if (!storedToken) {
            return errorResponse("Invalid refresh token", 401);
        }

        // Check if expired
        if (storedToken.expiresAt < new Date()) {
            // Delete expired token from DB
            await prisma.refreshToken.delete({
                where: { id: storedToken.id }
            });
            return errorResponse("Refresh token expired", 401);
        }

        // Token is valid! Rotate it. This is called token rotation
        const newAccessToken = signInToken(storedToken.userId);
        const newRefreshToken = generateRefreshToken();

        // Transaction: delete old token, create new one
        await prisma.$transaction([
            prisma.refreshToken.delete({
                where: { id: storedToken.id }
            }),
            prisma.refreshToken.create({
                data: {
                    token: newRefreshToken,
                    userId: storedToken.userId,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                }
            })
        ]);

        const response = successResponse("Token refreshed", { accessToken: newAccessToken });

        // Set the new access token in the cookie
        response.headers.append(
            "Set-Cookie",
            `accessToken=${newAccessToken}; Path=/; Max-Age=900; SameSite=Strict; ${
                process.env.NODE_ENV === "production" ? "Secure" : ""
            }`
        );

        // Set the new refresh token in the cookie
        response.headers.append(
            "Set-Cookie",
            `refreshToken=${newRefreshToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict; ${
                process.env.NODE_ENV === "production" ? "Secure" : ""
            }`
        );

        return response;
    } catch(e) {
        console.error(e);
        return errorResponse("Something went wrong", 500);
    }
}
