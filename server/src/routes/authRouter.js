import express from "express";
import { handleLogin, handleLogout, handleRefresh, handleSignup } from "../controllers/authController.js";

export const authRouter = express.Router();

authRouter.post("/login", handleLogin);

authRouter.post("/signup", handleSignup);

authRouter.post("/logout", handleLogout);

authRouter.post("/refresh", handleRefresh);
