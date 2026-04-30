import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET!;

export function signInToken(userId: string){
    return jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: "15m",
    });
}

export function generateRefreshToken() {
    return crypto.randomBytes(64).toString("hex");
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}


