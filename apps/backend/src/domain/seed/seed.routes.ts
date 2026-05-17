import { SeedContentBody, seedContentSchema } from '@zeronotes/shared';
import express, { Request, Response } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { asyncHandler } from '../../utils/asyncHandler';
import { seedService } from './seed.service';

const router = express.Router();

const seedContent = asyncHandler(
  async (req: Request<{}, {}, SeedContentBody>, res: Response<void>) => {
    await seedService.seedContent(req.userId!, req.body);
    res.status(201).send();
  },
);

router.post('/', authenticate, validate(seedContentSchema.body), seedContent);

export default router;
