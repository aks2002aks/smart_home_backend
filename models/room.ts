import mongoose, { Document } from "mongoose";
import User from "./user";
import Device from "./device";

export interface Room extends Document {
  user_id: mongoose.Schema.Types.ObjectId;
  device_id: mongoose.Schema.Types.ObjectId | null;
  room_name: string;
}

const roomSchema = new mongoose.Schema<Room>({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  device_id: {
    type: mongoose.Schema.Types.ObjectId || null,
    ref: Device,
    default: null,
  },
  room_name: { type: String, required: true, unique: true },
});

export default mongoose.model<Room>("Room", roomSchema);
