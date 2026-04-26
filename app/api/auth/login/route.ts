import { prisma } from '@/lib/prisma';
import { errorResponse, successResponse } from '@/lib/api-response';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { signInToken } from "@/lib/auth";


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password} = body;

        if (!email || !password) {
            return errorResponse("Email and password required", 400);
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !user.password) {
            return errorResponse("Invalid credentials", 401);
        }

        const isValid = await bcrypt.compare(password, user.password);

        if(!isValid){
            return errorResponse("Invalid Password", 401);
        }

        const token = signInToken(user.id);

        const response = successResponse("Login successful", { token });

        response.headers.set(
            "Set-Cookie",
            `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`
        );

        return response;
    } catch(e){
        return errorResponse("Something went wrong", 500);
    }
}