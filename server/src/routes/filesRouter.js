import express from "express";
import { checkAuth } from "../middlewares/middlewares.js";
import {
  handleGetFiles,
  handleGetFileContents,
  handleUploadFile,
  handleDelete,
  handleDownload,
} from "../controllers/fileController.js";

import { upload } from "../services/fileService.js";

export const filesRouter = express.Router();

filesRouter.use(checkAuth);

filesRouter.get("/myfiles", handleGetFiles);

filesRouter.get("/contents/:fileID", handleGetFileContents);

filesRouter.post("/upload", upload.single("file"), handleUploadFile);

filesRouter.delete("/myfiles", handleDelete);

filesRouter.get("/myfiles/download", handleDownload);