import express from "express";
import { checkAuth } from "../middlewares/middlewares.js";
import { handleGetFiles, handleUploadFile } from "../controllers/fileController.js";

import { upload } from "../services/fileService.js";

export const filesRouter = express.Router();

filesRouter.use(checkAuth);
filesRouter.get("/myfiles", handleGetFiles);
filesRouter.post("/upload", upload.single("file"), handleUploadFile);
