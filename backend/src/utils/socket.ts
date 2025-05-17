import { Server } from "socket.io";
import { User } from "../models/User";
import { Response } from "express";
import { Chat, messageInterface } from "../models/Chat";
import { timeStamp } from "console";
import mongoose from "mongoose";
const initializeSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userConnections = new Map();

  io.on("connection", (socket) => {
    let currentUserId: string | null = null;

    socket.on("joinChat", ({ userId, receiverId }) => {
      currentUserId = userId;
      if (!userConnections.has(userId)) {
        userConnections.set(userId, new Set());
      }
      userConnections.get(userId).add(socket.id);

      const roomId = [userId, receiverId].sort().join("_");
      socket.join(roomId);

      User.findByIdAndUpdate(userId, {
        isOnline: true,
      }).catch((err) => {
        console.error(err);
      });
    });
    socket.on(
      "sendMessage",
      async ({ message, firstName, userId, receiverId }) => {
        const roomId = [userId, receiverId].sort().join("_");

        try {
          let chat = await Chat.findOne({
            participants: {
              $all: [userId, receiverId],
            },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, receiverId],
              messages: [],
            });
            console.log("chat created");
            await chat.save();
          }

          chat.messages.push({
            senderId: new mongoose.Types.ObjectId(userId),
            message,
            isSeen: false,
          });

          await chat.save();

          const lastMessage = chat.messages[chat.messages.length - 1];

          io.to(roomId).emit("messageReceived", {
            message: message,
            firstName: firstName,
            senderId: userId,
          });
          console.log(`firstName: ${firstName}, message: ${message}`);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Error Sending Message";
          console.error(error);
          socket.emit("errorMessage", {
            error: "Failed to send message",
          });
        }
      }
    );

    socket.on("disconnect", async () => {
      if (currentUserId) {
        const userSockets = userConnections.get(currentUserId);
        if (userSockets) {
          userSockets.delete(socket.id);

          if (userSockets.size === 0) {
            userConnections.delete(currentUserId);
            try {
              await User.findByIdAndUpdate(currentUserId, {
                lastSeen: new Date(),
                isOnline: false,
              });
            } catch (error) {
              const errorMessage =
                error instanceof Error ? error.message : "Unauthorized";
              console.error(errorMessage);
            }
          }
        }
      }
    });
  });
};
