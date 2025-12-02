import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
});

export const encryptionSchema = z.object({
  salt: z.string(), // base64
  wrappedDataKey: z.string(), // base64
  kdfIterations: z.number(),
  version: z.number(),
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
      // Encryption details are optional for backward compatibility; once
      // clients are updated to always send them, this can be made required.
      encryption: encryptionSchema.optional(),
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
