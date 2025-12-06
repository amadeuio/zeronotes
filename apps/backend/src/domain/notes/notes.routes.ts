import {
  AddLabelToNoteParams,
  addLabelToNoteSchema,
  CreateLabelAndAddToNoteParams,
  createLabelAndAddToNoteSchema,
  CreateLabelBody,
  createLabelSchema,
  CreateNoteBody,
  createNoteSchema,
  DeleteNoteParams,
  deleteNoteSchema,
  Note,
  RemoveLabelFromNoteParams,
  removeLabelFromNoteSchema,
  ReorderNotesBody,
  reorderNotesSchema,
  UpdateNoteBody,
  UpdateNoteParams,
  updateNoteSchema,
} from '@zeronotes/shared';
import express, { Request, Response } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { NotFoundError } from '../../utils/AppError';
import { asyncHandler } from '../../utils/asyncHandler';
import { labelService } from '../labels/labels.service';
import { noteService } from './notes.service';

const router = express.Router();

const getAllNotes = asyncHandler(async (req: Request, res: Response<Note[]>) => {
  const notes = await noteService.findAll(req.userId!);
  res.json(notes);
});

const createNote = asyncHandler(
  async (req: Request<{}, {}, CreateNoteBody>, res: Response<{ id: string }>) => {
    const data = req.body;
    const noteId = await noteService.create(req.userId!, data);
    res.status(201).json({ id: noteId });
  },
);

const updateNote = asyncHandler(
  async (req: Request<UpdateNoteParams, {}, UpdateNoteBody>, res: Response<{ id: string }>) => {
    const { id } = req.params;
    const data = req.body;

    const noteId = await noteService.update(req.userId!, id, data);

    if (!noteId) {
      throw new NotFoundError('Note');
    }

    res.json({ id: noteId });
  },
);

const deleteNote = asyncHandler(async (req: Request<DeleteNoteParams>, res: Response<void>) => {
  const { id } = req.params;
  const deleted = await noteService.delete(req.userId!, id);

  if (!deleted) {
    throw new NotFoundError('Note');
  }

  res.status(204).send();
});

const addLabelToNote = asyncHandler(
  async (req: Request<AddLabelToNoteParams>, res: Response<void>) => {
    const { id, labelId } = req.params;
    await noteService.addLabel(id, labelId);
    res.status(204).send();
  },
);

const removeLabelFromNote = asyncHandler(
  async (req: Request<RemoveLabelFromNoteParams>, res: Response<void>) => {
    const { id, labelId } = req.params;
    await noteService.removeLabel(id, labelId);
    res.status(204).send();
  },
);

const createLabelAndAddToNote = asyncHandler(
  async (
    req: Request<CreateLabelAndAddToNoteParams, {}, CreateLabelBody>,
    res: Response<{ id: string }>,
  ) => {
    const { id } = req.params;
    const labelData = req.body;

    const label = await labelService.create(req.userId!, labelData);
    await noteService.addLabel(id, labelData.id);

    res.status(201).json({ id: label });
  },
);

const reorderNotes = asyncHandler(
  async (req: Request<{}, {}, ReorderNotesBody>, res: Response<void>) => {
    const { noteIds } = req.body;
    await noteService.reorder(req.userId!, noteIds);
    res.status(204).send();
  },
);

router.get('/', authenticate, getAllNotes);
router.post('/', authenticate, validate(createNoteSchema.body), createNote);
router.put(
  '/:id',
  authenticate,
  validate(updateNoteSchema.params, 'params'),
  validate(updateNoteSchema.body),
  updateNote,
);
router.delete('/:id', authenticate, validate(deleteNoteSchema.params, 'params'), deleteNote);
router.post(
  '/:id/labels/:labelId',
  authenticate,
  validate(addLabelToNoteSchema.params, 'params'),
  addLabelToNote,
);
router.delete(
  '/:id/labels/:labelId',
  authenticate,
  validate(removeLabelFromNoteSchema.params, 'params'),
  removeLabelFromNote,
);
router.post(
  '/:id/labels',
  authenticate,
  validate(createLabelAndAddToNoteSchema.params, 'params'),
  validate(createLabelSchema.body),
  createLabelAndAddToNote,
);
router.post('/reorder', authenticate, validate(reorderNotesSchema.body), reorderNotes);

export default router;
