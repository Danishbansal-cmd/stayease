import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET!;

export function signInToken(userId: string, role: string){
    return jwt.sign({ userId, role }, JWT_SECRET, {
        expiresIn: "15m",
    });
}

export function generateRefreshToken() {
    return crypto.randomBytes(64).toString("hex");
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string, role: string };
  } catch {
    return null;
  }
}


