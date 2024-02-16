import mongoose, { Document } from "mongoose";
import User from "./user";

export interface Device extends Document {
  alloted_to_user: mongoose.Schema.Types.ObjectId;
  deviceName: string;
  state: {
    light: number;
    fan: number;
    mis: number;
  };
}

const deviceSchema = new mongoose.Schema<Device>({
  alloted_to_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    default: null,
  },
  deviceName: { type: String, required: true, unique: true },
  state: {
    light: { type: Number, default: 0 },
    fan: { type: Number, default: 0 },
    mis: { type: Number, default: 0 },
  },
});

export default mongoose.model<Device>("Device", deviceSchema);
