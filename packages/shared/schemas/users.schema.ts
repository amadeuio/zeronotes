import { z } from "zod";
import { ENCRYPTION_VERSION, KDF_ITERATIONS } from "../constants/encryption";

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
});

export const encryptionSchema = z.object({
  salt: z.string(),
  wrappedDataKey: z.string(),
  kdfIterations: z
    .number()
    .min(KDF_ITERATIONS, `KDF iterations must be at least ${KDF_ITERATIONS}`),
  version: z
    .number()
    .min(
      ENCRYPTION_VERSION,
      `Encryption version must be at least ${ENCRYPTION_VERSION}`
    ),
});

export const authResponseSchema = z.object({
  user: userSchema,
  token: z.string(),
  encryption: encryptionSchema,
});

export const registerSchema = {
  body: z
    .object({
      email: z.string().email("Invalid email format"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password must be at most 100 characters"),
      encryption: encryptionSchema,
    })
    .strict(),
};

export const loginSchema = {
  body: z
    .object({
      email: z.string().email("Invalid email format"),
      password: z.string().min(1, "Password is required"),
    })
    .strict(),
};

export type User = z.infer<typeof userSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type RegisterBody = z.infer<typeof registerSchema.body>;
export type LoginBody = z.infer<typeof loginSchema.body>;
export type Encryption = z.infer<typeof encryptionSchema>;
