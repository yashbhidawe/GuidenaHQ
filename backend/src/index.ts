import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

import connectDB from "./config/db";
import { User } from "./models/User";
import userRouter from "./routes/userRouter";
import authRouter from "./routes/authRouter";
import feedRouter from "./routes/feedRouter";
import mentroshipRouter from "./routes/mentorshipRouter";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
connectDB();

app.use("/", userRouter);
app.use("/", authRouter);
app.use("/", feedRouter);
app.use("/", mentroshipRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
