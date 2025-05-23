import Express from "express";
import authMiddleware, { AuthenticatedRequest } from "../middleware/auth";
import { Chat } from "../models/Chat";
import { User } from "../models/User";
import { mentorshipRequestModel } from "../models/Mentorship";

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
      const receiver = await User.findById(receiverId).select(
        "firstName lastName avatar"
      );

      if (!receiver) {
        res.status(404).json({ message: "Receiver not found" });
        return;
      }
      const connectionExists = await mentorshipRequestModel.findOne({
        $or: [
          { mentor: userId, mentee: receiverId, status: "accepted" },
          { mentor: receiverId, mentee: userId, status: "accepted" },
        ],
      });

      if (!connectionExists) {
        res.status(403).json({
          message:
            "Cannot start chat - no accepted mentorship connection exists",
        });
        return;
      }
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
        receiverId: receiver._id,
        firstName: receiver.firstName,
        lastName: receiver.lastName,
        avatar: receiver.avatar,
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
