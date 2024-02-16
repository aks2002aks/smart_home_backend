import { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

async function serachUsername(req: Request, res: Response) {
  const { searchUsername } = req.body;

  try {

    const users = await User.find({
      username: { $regex: searchUsername, $options: "i" },
    })
      .select("-role -password")
      .limit(5);

    return res.status(200).json({
      success: true,
      users,
      message: "Usernames fetched successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

export { serachUsername };
