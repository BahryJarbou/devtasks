import type { Response } from "express";
import type { Authrequest } from "../middleware/authMiddleware.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../schemas/projectSchemas.js";
import * as projectService from "../services/projectService.js";
import { handleError } from "../utils/handleError.js";

export const getAllProjects = async (req: Authrequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const projects = await projectService.getProjects(userId);

    res.json(projects);
  } catch (err) {
    handleError(err, res);
  }
};

export const getProject = async (req: Authrequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const projectId = req.params.id as string;

    if (!projectId) {
      throw new Error("NOT_FOUND");
    }
    const project = await projectService.getProject(userId, projectId);
    res.json(project);
  } catch (err) {
    handleError(err, res);
  }
};

export const createProjectHandler = async (req: Authrequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const data = createProjectSchema.parse(req.body);

    const project = await projectService.createProject(
      userId,
      data.name!,
      data.description,
    );

    res.json(project);
  } catch (err) {
    handleError(err, res);
  }
};

export const updateProjectHandler = async (req: Authrequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const data = updateProjectSchema.parse(req.body);
    const projectId = req.params.id as string;

    if (!projectId) {
      throw new Error("NOT_FOUND");
    }

    const project = await projectService.updateProject(userId, projectId, data);

    res.json(project);
  } catch (err) {
    handleError(err, res);
  }
};

export const deleteProjectHandler = async (req: Authrequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const projectId = req.params.id as string;

    if (!projectId) {
      throw new Error("NOT_FOUND");
    }
    await projectService.deleteProject(userId, projectId);

    res.json({ success: true });
  } catch (err) {
    handleError(err, res);
  }
};
