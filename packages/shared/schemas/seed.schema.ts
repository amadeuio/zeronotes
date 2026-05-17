import { z } from "zod";
import { findDuplicateId } from "../utils/ids";
import { labelSchema } from "./labels.schema";
import { noteSchema } from "./notes.schema";

const seedContentBodySchema = z
  .object({
    labels: z.array(labelSchema),
    notes: z.array(noteSchema).min(1, "At least one note is required"),
  })
  .strict()
  .superRefine((data, ctx) => {
    const duplicateLabelId = findDuplicateId(
      data.labels.map((label) => label.id),
    );
    if (duplicateLabelId) {
      ctx.addIssue({
        code: "custom",
        message: `Duplicate label id: ${duplicateLabelId}`,
        path: ["labels"],
      });
    }

    const duplicateNoteId = findDuplicateId(data.notes.map((note) => note.id));
    if (duplicateNoteId) {
      ctx.addIssue({
        code: "custom",
        message: `Duplicate note id: ${duplicateNoteId}`,
        path: ["notes"],
      });
    }

    const labelIds = new Set(data.labels.map((label) => label.id));

    for (const [index, note] of data.notes.entries()) {
      for (const labelId of note.labelIds) {
        if (!labelIds.has(labelId)) {
          ctx.addIssue({
            code: "custom",
            message: `Note references unknown label ${labelId} in seed batch`,
            path: ["notes", index, "labelIds"],
          });
        }
      }
    }
  });

export const seedContentSchema = {
  body: seedContentBodySchema,
};

export type SeedContentBody = z.infer<typeof seedContentBodySchema>;
