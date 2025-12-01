import express, { Request, Response } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { bootstrapService } from "./bootstrap.service";

const router = express.Router();

const getBootstrap = asyncHandler(async (req: Request, res: Response) => {
  const bootstrap = await bootstrapService.findAll(req.userId!);
  res.json(bootstrap);
});

router.get("/", authenticate, getBootstrap);

export default router;
