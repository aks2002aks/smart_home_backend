// routes/userRoutes.ts

import express from "express";
import { DecodeToken, Login, Signup } from "../controllers/authController";
import { isLoggedIn } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/Login", Login);
router.post("/Signup", Signup);
router.get("/DecodeToken", isLoggedIn, DecodeToken);

export default router;
