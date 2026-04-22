import { successResponse } from "@/lib/api-response";

export async function POST() {
    const res = successResponse("Logged out");

    res.headers.set(
        "Set-Cookie",
        `token=; HttpOnly; Path=/; Max-Age=0`
    );

    return res;
}