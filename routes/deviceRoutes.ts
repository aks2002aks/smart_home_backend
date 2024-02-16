// routes/userRoutes.ts

import express from "express";
import {
  addDevice,
  allocateDevice,
  changeDeviceState,
  getAllDevices,
  getAllocatedDevices,
  getUnallocatedDevices,
} from "../controllers/deviceController";
import { isLoggedIn } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/addDevice", isLoggedIn, addDevice);
router.get("/getUnallocatedDevices", isLoggedIn, getUnallocatedDevices);
router.get("/getAllocatedDevices", isLoggedIn, getAllocatedDevices);
router.get("/getAllDevices", isLoggedIn, getAllDevices);
router.post("/allocateDevice", isLoggedIn, allocateDevice);
router.post("/changeDeviceState", isLoggedIn, changeDeviceState);

export default router;
