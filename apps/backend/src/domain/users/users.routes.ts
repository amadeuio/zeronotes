import { loginSchema, registerSchema } from '@zeronotes/shared';
import express, { Request, Response } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { AuthError, NotFoundError } from '../../utils/AppError';
import { asyncHandler } from '../../utils/asyncHandler';
import { userService } from './users.service';

const router = express.Router();

const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.register(req.body);
  res.status(201).json(result);
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.login(req.body);
  res.json(result);
});

const me = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    throw new AuthError();
  }

  const result = await userService.findById(userId);
  if (!result) {
    throw new NotFoundError('User');
  }

  res.json(result);
});

router.post('/register', validate(registerSchema.body), register);
router.post('/login', validate(loginSchema.body), login);
router.get('/me', authenticate, me);

export default router;
