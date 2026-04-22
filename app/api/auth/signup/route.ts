import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function POST(req: Request) {
    const body = await req.json();
    const { name, email, password, role} = body;

    if (!email || !password) {
      return errorResponse("Email and password required", 400);
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    try{
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role
            }
        });

        return successResponse("User created successfully", user)
    }catch (e){
        return errorResponse("User already exists", 400);
    }
}
