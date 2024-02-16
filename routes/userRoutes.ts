// routes/userRoutes.ts

import express from "express";

import { isLoggedIn } from "../middleware/authMiddleware";
import { serachUsername } from "../controllers/userController";

const router = express.Router();

router.post("/serachUsername", isLoggedIn, serachUsername);

export default router;
