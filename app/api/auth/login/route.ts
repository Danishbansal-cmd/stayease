import { prisma } from '@/lib/prisma';
import { errorResponse, successResponse } from '@/lib/api-response';
import bcrypt from 'bcrypt';
import { signInToken } from "@/lib/auth";
import { loginRateLimit } from "@/lib/rate-limit";


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password} = body;

        if (!email || !password) {
            return errorResponse("Email and password required", 400);
        }

        // Get client IP
        const ip =
            req.headers.get("x-forwarded-for") ?? "anonymous";

        // creating the key that is `ip:email`
        const identifier = `${ip}:${email}`;

        // rate limit check
        const { success } = await loginRateLimit.limit(identifier);

        if (!success) {
            return errorResponse(
                "Too many login attempts. Please try again later.",
                429
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !user.password) {
            return errorResponse("Invalid credentials", 401);
        }

        const isValid = await bcrypt.compare(password, user.password);

        if(!isValid){
            return errorResponse("Invalid credentials", 401);
        }

        const token = signInToken(user.id);

        const response = successResponse("Login successful", { token });

        response.headers.set(
            "Set-Cookie",
            `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict ${
                process.env.NODE_ENV === "production"
                    ? "Secure;"
                    : ""
            }`
        );

        return response;
    } catch(e){
        console.error(e);
        
        return errorResponse("Something went wrong", 500);
    }
}


