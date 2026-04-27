import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getAllProjects,
  createProjectHandler,
  updateProjectHandler,
  deleteProjectHandler,
} from "../controllers/projectController.js";
import { de } from "zod/locales";

const projectRouter = Router();

projectRouter.use(authMiddleware);

projectRouter.get("/", getAllProjects);
projectRouter.get("/:id", getAllProjects);
projectRouter.post("/", createProjectHandler);
projectRouter.put("/:id", updateProjectHandler);
projectRouter.delete("/:id", deleteProjectHandler);

export default projectRouter;
