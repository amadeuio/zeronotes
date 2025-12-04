import { z } from "zod";
import { labelSchema } from "./labels.schema";
import { noteSchema } from "./notes.schema";

export const bootstrapDataSchema = z.object({
  notes: z.array(noteSchema),
  labels: z.array(labelSchema),
});

export type BootstrapData = z.infer<typeof bootstrapDataSchema>;
