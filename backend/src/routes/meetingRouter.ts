import { Request, Response, Router } from "express";
import authMiddleware, { AuthenticatedRequest } from "../middleware/auth";
import { Meeting } from "../models/Meetings";

const meetingRouter = Router();

meetingRouter.post(
  "/meetings/schedule",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const authenticatedReq = req as AuthenticatedRequest;
      const { receiverId, dateTime, title, roomName } = req.body;
      if (!receiverId || !dateTime || !title || !roomName) {
        res.status(400).json({ error: "All fields are required" });
        return;
      }

      const meeting = await Meeting.create({
        hostId: authenticatedReq.user._id,
        receiverId,
        dateTime,
        title,
        roomName,
      });

      res.status(201).json(meeting);
    } catch (error) {
      console.error("Meeting scheduling error:", error);
      res.status(500).json({ error: "Failed to schedule meeting" });
    }
  }
);

meetingRouter.get(
  "/meetings",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const authenticatedReq = req as AuthenticatedRequest;
      const meetings = await Meeting.find({
        $or: [
          { hostId: authenticatedReq.user._id },
          { receiverId: authenticatedReq.user._id },
        ],
      }).sort({ dateTime: 1 });
      res.status(200).json(meetings);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      res.status(500).json({ error: "Failed to fetch meetings" });
    }
  }
);

meetingRouter.delete(
  "/meetings/:meetingId",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const authenticatedReq = req as AuthenticatedRequest;
      const { meetingId } = req.params;

      const meeting = await Meeting.findOne({
        _id: meetingId,
        hostId: authenticatedReq.user._id,
      });

      if (!meeting) {
        res.status(404).json({ error: "Meeting not found or unauthorized" });
        return;
      }

      await Meeting.findByIdAndDelete(meetingId);
      res.status(200).json({ message: "Meeting cancelled successfully" });
    } catch (error) {
      console.error("Error cancelling meeting:", error);
      res.status(500).json({ error: "Failed to cancel meeting" });
    }
  }
);

export default meetingRouter;
