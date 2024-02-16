// routes/userRoutes.ts

import express from "express";

import { isLoggedIn } from "../middleware/authMiddleware";
import {
  addDeviceToRoom,
  addRoom,
  getAllRooms,
  removeDeviceFromRoom,
} from "../controllers/roomController";

const router = express.Router();

router.post("/addRoom", isLoggedIn, addRoom);
router.get("/getAllRooms", isLoggedIn, getAllRooms);
router.post("/addDeviceToRoom", isLoggedIn, addDeviceToRoom);
router.post("/removeDeviceFromRoom", isLoggedIn, removeDeviceFromRoom);

export default router;
