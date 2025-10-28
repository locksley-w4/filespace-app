import express from "express";
import { handleGetFiles } from "../controllers/fileController.js";
import { authRouter } from "./authRouter.js";
import { checkAuth } from "../middlewares/middlewares.js";

export const userRouter = express.Router();

userRouter.use("/auth", authRouter);

userRouter.get("/file/myfiles", checkAuth, handleGetFiles);