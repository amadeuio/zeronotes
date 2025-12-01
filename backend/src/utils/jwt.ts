import { SignJWT, jwtVerify } from "jose";
import { env } from "./env";

const SECRET = new TextEncoder().encode(env.JWT_SECRET);

export const createToken = async (userId: string): Promise<string> =>
  new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(env.JWT_EXPIRES_IN)
    .sign(SECRET);

export const verifyToken = async (token: string): Promise<string> => {
  const result = await jwtVerify(token, SECRET);
  return result.payload.userId as string;
};
