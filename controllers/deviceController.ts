import { Request, Response } from "express";
import dotenv from "dotenv";
import Device from "../models/device";

dotenv.config();

async function addDevice(req: Request, res: Response) {
  try {
    const { deviceName } = req.body;

    if (!deviceName) {
      return res
        .status(201)
        .json({ success: false, message: "Device name is required" });
    }

    const existingDevice = await Device.findOne({ deviceName });
    if (existingDevice) {
      return res.status(201).json({
        success: false,
        message: "Device with the same name already exists",
      });
    }

    const device = new Device({ deviceName });
    const isSaved = await device.save();
    if (!isSaved) {
      return res
        .status(201)
        .json({ success: false, message: "Failed to add device" });
    }
    return res
      .status(201)
      .json({ success: true, message: "Device added successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" + error });
  }
}

async function getUnallocatedDevices(req: Request, res: Response) {
  try {
    const { page } = req.query;
    const pageSize = 10;
    const skip = (Number(page) - 1) * pageSize;

    const unallocatedDevices = await Device.find({ alloted_to_user: null })
      .skip(skip)
      .limit(pageSize);

    return res.status(200).json({
      success: true,
      data: unallocatedDevices,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" + error });
  }
}

async function getAllocatedDevices(req: Request, res: Response) {
  try {
    const { page } = req.query;
    const pageSize = 10;
    const skip = (Number(page) - 1) * pageSize;

    const allocatedDevices = await Device.find({
      alloted_to_user: { $ne: null },
    })
      .skip(skip)
      .limit(pageSize);

    return res.status(200).json({
      success: true,
      data: allocatedDevices,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" + error });
  }
}

async function getAllDevices(req: Request, res: Response) {
  try {
    const { page, userId } = req.query;
    const pageSize = 10;
    const skip = (Number(page) - 1) * pageSize;

    if (userId) {
      const devices = await Device.find({ alloted_to_user: userId })
        .skip(skip)
        .limit(pageSize);
      return res.status(200).json({
        success: true,
        data: devices,
      });
    }

    const devices = await Device.find().skip(skip).limit(pageSize);
    return res.status(200).json({
      success: true,
      data: devices,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" + error });
  }
}

async function allocateDevice(req: Request, res: Response) {
  try {
    const { deviceId, userId } = req.body;
    if (!deviceId || !userId) {
      return res.status(200).json({
        success: false,
        message: "Device ID and User ID are required",
      });
    }

    const device = await Device.findById(deviceId);
    if (!device) {
      return res
        .status(200)
        .json({ success: false, message: "Device not found" });
    }

    device.alloted_to_user = userId;
    const isSaved = await device.save();
    if (!isSaved) {
      return res
        .status(200)
        .json({ success: false, message: "Failed to allocate device" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Device allocated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" + error });
  }
}

async function changeDeviceState(req: Request, res: Response) {
  try {
    const { deviceId, newState } = req.body;

    if (!deviceId || !newState) {
      return res.status(200).json({
        success: false,
        message: "Device ID and new state are required",
      });
    }
    const userId = res.locals.userId;

    const device = await Device.findById({
      _id: deviceId,
      alloted_to_user: userId,
    });

    if (!device) {
      return res
        .status(200)
        .json({ success: false, message: "Device not found" });
    }

    device.state = newState;
    const isSaved = await device.save();
    if (!isSaved) {
      return res
        .status(200)
        .json({ success: false, message: "Failed to change device state" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Device state changed successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" + error });
  }
}

export {
  addDevice,
  getUnallocatedDevices,
  getAllocatedDevices,
  allocateDevice,
  getAllDevices,
  changeDeviceState,
};
