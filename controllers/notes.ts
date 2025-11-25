import { NextFunction, Request, Response } from "express";
import Label from "../models/Label";
import Note from "../models/Note";
import NoteLabel from "../models/NoteLabel";
import { CreateLabelRequest } from "../types/labels";
import { CreateNoteRequest, NoteUpdateRequest } from "../types/notes";

const getAllNotes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const notes = await Note.getAll();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "get_all_notes_failed" });
  }
};

const createNote = async (
  req: Request<{}, {}, CreateNoteRequest>,
  res: Response
): Promise<void> => {
  const { id, title, content, colorId, isPinned, isArchived, labelIds } =
    req.body;

  if (!id) {
    res.status(400).json({ error: "missing_id" });
    return;
  }

  try {
    const note = await Note.create({
      id,
      title,
      content,
      colorId,
      isPinned,
      isArchived,
    });

    if (Array.isArray(labelIds) && labelIds.length > 0) {
      await NoteLabel.addLabelsToNote(note.id, labelIds);
    }

    res.status(201).json({ data: note });
  } catch (error) {
    res.status(500).json({ error: "create_note_failed" });
  }
};

const updateNote = async (
  req: Request<{ id: string }, {}, NoteUpdateRequest>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const note = await Note.update(id, updates);

    if (!note) {
      res.status(404).json({ error: "note_not_found" });
      return;
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ error: "update_note_failed" });
  }
};

const deleteNote = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const note = await Note.deleteById(id);

    if (!note) {
      res.status(404).json({ error: "note_not_found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "delete_note_failed" });
  }
};

const addLabelToNote = async (
  req: Request<{ id: string; labelId: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id, labelId } = req.params;

    await NoteLabel.addLabelToNote(id, labelId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "add_label_to_note_failed" });
  }
};

const removeLabelFromNote = async (
  req: Request<{ id: string; labelId: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id, labelId } = req.params;

    await NoteLabel.removeLabelFromNote(id, labelId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "remove_label_from_note_failed" });
  }
};

const createLabelAndAddToNote = async (
  req: Request<{ id: string }, {}, CreateLabelRequest>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const noteId = req.params.id;
    const { id: labelId, name } = req.body;

    await Label.create(labelId, name);
    await NoteLabel.addLabelToNote(noteId, labelId);

    res.status(201).json({ id: labelId, name });
  } catch (error) {
    next(error);
  }
};

export {
  addLabelToNote,
  createLabelAndAddToNote,
  createNote,
  deleteNote,
  getAllNotes,
  removeLabelFromNote,
  updateNote,
};
