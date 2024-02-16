import { Request, Response } from "express";
import dotenv from "dotenv";
import Room from "../models/room";
const { ObjectId } = require("mongoose").Types;

dotenv.config();

async function addRoom(req: Request, res: Response) {
  try {
    const { roomName, userId } = req.body;

    if (!roomName || !userId) {
      return res
        .status(201)
        .json({ success: false, message: "Room name or userId is required" });
    }

    const existingRoom = await Room.findOne({
      room_name: roomName,
      user_id: userId,
    });

    if (existingRoom) {
      return res.status(201).json({
        success: false,
        message: "Room with the same name already exists",
      });
    }

    const room = new Room({ room_name: roomName, user_id: userId });

    const isSaved = await room.save();

    if (!isSaved) {
      return res
        .status(201)
        .json({ success: false, message: "Failed to add device" });
    }
    return res
      .status(201)
      .json({ success: true, message: "Room added successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" + error });
  }
}

async function getAllRooms(req: Request, res: Response) {
  try {
    const userId = res.locals.userId;

    if (!userId) {
      return res
        .status(200)
        .json({ success: false, message: "userId is required" });
    }

    const rooms = await Room.find({ user_id: userId });
    return res.status(200).json({ success: true, data: rooms });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" + error });
  }
}

async function addDeviceToRoom(req: Request, res: Response) {
  try {
    const { deviceId, roomName } = req.body;
    if (!deviceId || !roomName) {
      return res.status(200).json({
        success: false,
        message: "deviceId and roomName are required",
      });
    }

    const room = await Room.findOne({ room_name: roomName });

    if (!room) {
      return res
        .status(200)
        .json({ success: false, message: "Room not found" });
    }

    room.device_id = deviceId;
    const updatedRoom = await room.save();

    return res.status(200).json({
      success: true,
      message: "Device added to room successfully",
      data: updatedRoom,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" + error });
  }
}

async function removeDeviceFromRoom(req: Request, res: Response) {
  try {
    const { deviceId } = req.body;
    if (!deviceId) {
      return res.status(200).json({
        success: false,
        message: "deviceId and roomName are required",
      });
    }

    const room = await Room.findOne({ device_id: deviceId });

    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    const deviceIdObject = new ObjectId(deviceId);
  
    if (!room.device_id || !deviceIdObject.equals(room.device_id)) {
      return res.status(200).json({
        success: false,
        message: "Device is not assigned to this room",
      });
    }

    room.device_id = null;
    const updatedRoom = await room.save();

    return res.status(200).json({
      success: true,
      message: "Device removed from room successfully",
      data: updatedRoom,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" + error });
  }
}

export { addRoom, getAllRooms, addDeviceToRoom, removeDeviceFromRoom };
