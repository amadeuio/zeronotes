import { z } from "zod";
import { labelSchema } from "./labels.schema";
import { noteSchema } from "./notes.schema";

export const bootstrapDataSchema = z.object({
  notesById: z.record(z.string().uuid(), noteSchema),
  notesOrder: z.array(z.string().uuid()),
  labelsById: z.record(z.string().uuid(), labelSchema),
});

export type BootstrapData = z.infer<typeof bootstrapDataSchema>;
