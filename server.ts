// server.ts

import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import dotenv from "dotenv";
import { connectDatabase } from "./database";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import deviceRoutes from "./routes/deviceRoutes";
import userRoutes from "./routes/userRoutes";
import roomRoutes from "./routes/roomRoutes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(mongoSanitize());

// Connect to MongoDB and redisDB
connectDatabase();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Routes
app.use("/api", authRoutes);
app.use("/api", deviceRoutes);
app.use("/api", userRoutes);
app.use("/api", roomRoutes);

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
