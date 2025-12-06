import {
  CreateLabelBody,
  createLabelSchema,
  DeleteLabelParams,
  deleteLabelSchema,
  Label,
  UpdateLabelBody,
  UpdateLabelParams,
  updateLabelSchema,
} from '@zeronotes/shared';
import express, { Request, Response } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { NotFoundError } from '../../utils/AppError';
import { asyncHandler } from '../../utils/asyncHandler';
import { labelService } from './labels.service';

const router = express.Router();

const getAllLabels = asyncHandler(async (req: Request, res: Response<Label[]>) => {
  const labels = await labelService.findAll(req.userId!);
  res.json(labels);
});

const createLabel = asyncHandler(
  async (req: Request<{}, {}, CreateLabelBody>, res: Response<{ id: string }>) => {
    const data = req.body;
    const labelId = await labelService.create(req.userId!, data);
    res.status(201).json({ id: labelId });
  },
);

const updateLabel = asyncHandler(
  async (req: Request<UpdateLabelParams, {}, UpdateLabelBody>, res: Response<{ id: string }>) => {
    const { id } = req.params;
    const data = req.body;

    const labelId = await labelService.update(req.userId!, id, data);

    if (!labelId) {
      throw new NotFoundError('Label');
    }

    res.json({ id: labelId });
  },
);

const deleteLabel = asyncHandler(async (req: Request<DeleteLabelParams>, res: Response<void>) => {
  const { id } = req.params;
  const deleted = await labelService.delete(req.userId!, id);

  if (!deleted) {
    throw new NotFoundError('Label');
  }

  res.status(204).send();
});

router.get('/', authenticate, getAllLabels);
router.post('/', authenticate, validate(createLabelSchema.body), createLabel);
router.put(
  '/:id',
  authenticate,
  validate(updateLabelSchema.params, 'params'),
  validate(updateLabelSchema.body),
  updateLabel,
);
router.delete('/:id', authenticate, validate(deleteLabelSchema.params, 'params'), deleteLabel);

export default router;
