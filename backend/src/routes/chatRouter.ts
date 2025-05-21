import Express from "express";
import authMiddleware, { AuthenticatedRequest } from "../middleware/auth";
import { Chat } from "../models/Chat";

const chatRouter = Express.Router();

chatRouter.get(
  "/chat/:receiverId",
  authMiddleware,
  async (req: AuthenticatedRequest, res) => {
    const { receiverId } = req.params;
    const userId = req.user!._id;

    console.log(receiverId, "receiverId");
    console.log(userId, "userId");

    try {
      let chat = await Chat.findOne({
        participants: { $all: [userId, receiverId] },
      }).populate({
        path: "messages.senderId",
        select: "firstName lastName avatar",
      });
      if (!chat) {
        console.log("Chat not found, creating a new one");
        chat = await Chat.create({
          participants: [userId, receiverId],
          messages: [],
          firstName: req.user?.firstName,
        });
        console.log("New chat created:", chat);
        await chat.save();
      }
      res.status(200).json({
        message: "chat created",
        data: chat,
      });
    } catch (error) {
      console.error("Error fetching chat:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch chat";
      res.status(500).json({ message: errorMessage });
    }
  }
);

export default chatRouter;
