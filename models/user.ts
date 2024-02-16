// models/user.ts

import mongoose, { Document } from "mongoose";

export interface User extends Document {
  username: string;
  password: string;
  role: string;
}

const userSchema = new mongoose.Schema<User>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["Customer", "Admin"],
    required: true,
    default: "Customer",
  },
});

export default mongoose.model<User>("User", userSchema);
