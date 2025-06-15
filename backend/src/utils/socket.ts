import { Server } from "socket.io";
import { User } from "../models/User";
import { Chat } from "../models/Chat";
import mongoose from "mongoose";
import { BASE_URL } from "./constants";

export const initializeSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: BASE_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userConnections = new Map();

  io.on("connection", (socket) => {
    let currentUserId: string | null = null;

    socket.on("joinChat", async ({ userId, receiverId }) => {
      currentUserId = userId;

      if (!userConnections.has(userId)) {
        userConnections.set(userId, new Set());
      }
      userConnections.get(userId).add(socket.id);

      const roomId = [userId, receiverId].sort().join("_");
      socket.join(roomId);

      try {
        await User.findByIdAndUpdate(userId, {
          isOnline: true,
        });
      } catch (err) {
        console.error(`❌ Error updating online status:`, err);
      }
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

          if (chat)
            console.log(`chat found between ${userId + "and" + receiverId}`);
          if (!chat) {
            chat = new Chat({
              participants: [userId, receiverId],
              messages: [],
            });
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
            message: lastMessage.message,
            firstName: firstName,
            senderId: userId,
          });
        } catch (error) {
          console.error("❌ Error sending message:", error);
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
              console.error("❌ Error updating offline status:", error);
            }
          }
        }
      }
    });
  });
};
