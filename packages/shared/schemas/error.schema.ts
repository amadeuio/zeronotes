import { z } from "zod";

export const errorSchema = z.object({
  error: z.object({
    message: z.string(),
    code: z.string(),
    status: z.number(),
    details: z.unknown().optional(),
  }),
});

export type ErrorResponse = z.infer<typeof errorSchema>;
