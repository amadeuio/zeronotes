import express, { Request, Response } from "express";
import { labelService } from "../domain/labels/label.service";
import {
  LabelCreateRequest,
  LabelUpdateRequest,
} from "../domain/labels/label.types";

const router = express.Router();

const getAllLabels = async (_req: Request, res: Response) => {
  try {
    const labels = await labelService.findAll();
    res.json(labels);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch labels" });
  }
};

const createLabel = async (
  req: Request<{}, {}, LabelCreateRequest>,
  res: Response
) => {
  try {
    const data = req.body;

    if (!data.id || !data.name) {
      res.status(400).json({ error: "id and name are required" });
      return;
    }

    const labelId = await labelService.create(data);
    res.status(201).json(labelId);
  } catch (error) {
    res.status(500).json({ error: "Failed to create label" });
  }
};

const updateLabel = async (
  req: Request<{ id: string }, {}, LabelUpdateRequest>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (!data.name) {
      res.status(400).json({ error: "Name is required" });
      return;
    }

    const labelId = await labelService.update(id, data);

    if (!labelId) {
      res.status(404).json({ error: "Label not found" });
      return;
    }

    res.json(labelId);
  } catch (error) {
    res.status(500).json({ error: "Failed to update label" });
  }
};

const deleteLabel = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await labelService.delete(id);

    if (!deleted) {
      res.status(404).json({ error: "Label not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete label" });
  }
};

router.get("/", getAllLabels);
router.post("/", createLabel);
router.put("/:id", updateLabel);
router.delete("/:id", deleteLabel);

export default router;
