import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
dotenv.config();

import connectDB from "./config/db";
import { User } from "./models/User";
import userRouter from "./routes/userRouter";
import authRouter from "./routes/authRouter";
import feedRouter from "./routes/feedRouter";
import mentroshipRouter from "./routes/mentorshipRouter";
import { BASE_URL } from "./utils/constants";
import { initializeSocket } from "./utils/socket";
import chatRouter from "./routes/chatRouter";
import meetingRouter from "./routes/meetingRouter";
import "./config/passport";
import passport from "passport";

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

app.use(express.json());

app.use(cookieParser());
app.use(cors({ origin: BASE_URL, credentials: true }));

connectDB();

app.use("/", userRouter);
app.use("/", authRouter);
app.use("/", feedRouter);
app.use("/", chatRouter);
app.use("/", mentroshipRouter);
app.use("/", meetingRouter);

app.use(passport.initialize());

initializeSocket(server);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
