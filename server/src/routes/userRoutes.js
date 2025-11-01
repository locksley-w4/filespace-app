import express from "express";
import { authRouter } from "./authRouter.js";
import { filesRouter } from "./filesRouter.js";

export const userRouter = express.Router();

userRouter.use("/auth", authRouter);

userRouter.use("/file", filesRouter);
