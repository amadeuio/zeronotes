import { noteLabelQueries } from "../../db/queries/noteLabels";
import { noteQueries } from "../../db/queries/notes";
import { noteMappers } from "./note.mappers";
import { NoteAPI, NoteCreateRequest, NoteUpdateRequest } from "./note.types";

export const noteService = {
  findAllWithLabels: async (): Promise<NoteAPI[]> => {
    const notes = await noteQueries.findAllWithLabels();
    return notes.map(noteMappers.dbToAPI);
  },

  create: async (data: NoteCreateRequest): Promise<string> => {
    const minOrder = await noteQueries.getMinOrder();

    const note = await noteQueries.create(
      data.id,
      minOrder,
      data.title,
      data.content,
      data.colorId,
      data.isPinned,
      data.isArchived
    );

    if (Array.isArray(data.labelIds) && data.labelIds.length > 0) {
      await noteLabelQueries.addLabelsToNote(note.id, data.labelIds);
    }

    return note.id;
  },

  update: async (id: string, data: NoteUpdateRequest): Promise<string> => {
    const note = await noteQueries.update(
      id,
      data.title,
      data.content,
      data.colorId,
      data.isPinned,
      data.isArchived
    );

    return note.id;
  },

  delete: async (id: string): Promise<boolean> => {
    return await noteQueries.delete(id);
  },

  addLabel: async (noteId: string, labelId: string): Promise<void> => {
    await noteLabelQueries.addLabelToNote(noteId, labelId);
  },

  removeLabel: async (noteId: string, labelId: string): Promise<void> => {
    await noteLabelQueries.removeLabelFromNote(noteId, labelId);
  },
};
