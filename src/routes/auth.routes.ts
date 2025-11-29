import express, { Request, Response } from "express";
import { userService } from "../domain/users/user.service";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

const register = async (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const result = await userService.register({ email, password });
    res.status(201).json(result);
  } catch (error: any) {
    if (error.message === "User already exists") {
      res.status(409).json({ error: "User already exists" });
    } else {
      res.status(500).json({ error: "Failed to register user" });
    }
  }
};

const login = async (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const result = await userService.login({ email, password });
    res.json(result);
  } catch (error: any) {
    if (error.message === "Invalid credentials") {
      res.status(401).json({ error: "Invalid credentials" });
    } else {
      res.status(500).json({ error: "Failed to login" });
    }
  }
};

const me = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await userService.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to get user" });
  }
};

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, me);

export default router;
