import { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

async function Login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const token = jwt.sign(
          { userId: user._id, username: user.username, role: user.role },
          process.env.JWT_TOKEN as string
        );

        res.cookie("AuthToken", token, {
          // httpOnly: true,
          // secure: true,
          path: "/",
        });

        return res.status(200).json({
          success: true,
          userId: user._id,
          message: "Login ScuccesFull",
          username: user.username,
          role: user.role,
          token,
        });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Invalid username or password" });
      }
    } else {
      return res.status(401).json({
        success: false,
        message: "Credetials Does not Exist. Please Singup",
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" + error });
  }
}

async function Signup(req: Request, res: Response) {
  try {
    const { username, password, role } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      return res
        .status(200)
        .json({ success: false, message: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();
    return res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" + error });
  }
}

async function DecodeToken(req: Request, res: Response) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token not found" });
    }
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_TOKEN as string
    ) as jwt.JwtPayload;

    return res.status(200).json({
      success: true,
      userId: decodedToken.userId,
      username: decodedToken.username,
      role: decodedToken.role,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" + error });
  }
}

export { Login, Signup, DecodeToken };
