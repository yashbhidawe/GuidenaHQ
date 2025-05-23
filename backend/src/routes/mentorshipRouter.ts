import express from "express";
import { mentorshipRequestModel } from "../models/Mentorship";
import authMiddleware, { AuthenticatedRequest } from "../middleware/auth";
import { User } from "../models/User";
import mongoose from "mongoose";

const mentorshipRouter = express.Router();
//send route specific for feed page
mentorshipRouter.post(
  "/mentorship/request/send/:mentor",
  authMiddleware,
  async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user;
      const userId = req?.user?._id;
      if (!user) {
        throw new Error("user not found!");
      }
      const menteeId = user._id;
      const mentorId = req.params.mentor;

      const connectionExists = await mentorshipRequestModel.findOne({
        $or: [
          { mentor: userId, mentee: menteeId, status: "accepted" },
          { mentor: menteeId, mentee: userId, status: "accepted" },
        ],
      });

      if (!connectionExists) {
        res.status(403).json({
          message: "Cannot send a request if connection is already present ",
        });
        return;
      }
      const pitchMessage = req.body.pitchMessage;
      if (!pitchMessage) {
        res.status(400).json({
          message: "please provide a pitch message",
        });
        return;
      }
      if (pitchMessage.length > 500) {
        res.status(400).json({
          message: "pitch message should be less than 500 characters",
        });
        return;
      }

      const mentor = await User.findById(mentorId);
      if (!mentor) {
        res.status(404).json({ message: "user not found" });
      }

      const existingConnection = await mentorshipRequestModel.findOne({
        $or: [
          { menteeId: menteeId, mentorId: mentorId },
          { menteeId: mentorId, mentorId: menteeId },
        ],
      });

      if (existingConnection) {
        res.status(400).json({
          message: "conncetion already exists",
        });
        return;
      }

      const newMentorship = new mentorshipRequestModel({
        mentee: menteeId,
        mentor: mentorId,
        pitchMessage: pitchMessage,
        status: "pending",
      });
      await newMentorship.save();
      res.status(200).json({
        message: "mentorship request sent succesfully",
        data: newMentorship,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      console.log(errorMessage);
      res.status(401).json({ message: errorMessage });
    }
  }
);

//group
//request recived route  -main
mentorshipRouter.get(
  "/mentorship/request/received",
  authMiddleware,
  async (req: AuthenticatedRequest, res) => {
    try {
      const loggedInUser = req.user;
      if (!loggedInUser) {
        res.status(401).json({
          message: "Unauthorized",
        });
        return;
      }

      const mentorshipRequests = await mentorshipRequestModel
        .find({
          mentor: loggedInUser._id,
          status: "pending",
        })
        .populate(
          "mentee",
          "firstName lastName avatar bio skillsWanted experience email "
        );

      if (!mentorshipRequests) {
        res.status(404).json({
          message: "no mentorship request found",
        });
        return;
      }

      res.json({
        data: mentorshipRequests,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Request not found";
      res.status(401).json({ message: errorMessage });
    }
  }
);
//review route -action
mentorshipRouter.post(
  "/mentorship/request/review/:status/:requestId",
  authMiddleware,
  async (req: AuthenticatedRequest, res) => {
    console.log("Route hit:", {
      status: req.params.status,
      requestId: req.params.requestId,
      user: req.user?._id,
    });
    try {
      const loggedInUser = req.user;
      if (!loggedInUser) {
        res.status(401).json({
          message: "Unauthorized",
        });
        return;
      }
      const requestId = req.params.requestId;
      const status = req.params.status;

      const allowedStatuses = ["accepted", "rejected"];
      if (!allowedStatuses.includes(status)) {
        res.status(400).json({
          message: "invalid status",
        });
        return;
      }
      const mentorshipRequest = await mentorshipRequestModel.findOne({
        _id: requestId,
        mentor: loggedInUser._id,
        status: "pending",
      });
      if (!mentorshipRequest) {
        res.status(404).json({
          message: "mentorship request not found",
        });
        return;
      }
      mentorshipRequest.status = status as "accepted" | "rejected";
      await mentorshipRequest.save();
      res.status(200).json({
        message: `mentorship request ${status} successfully`,
        data: mentorshipRequest,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      res.status(401).json({ message: errorMessage });
    }
  }
);

//group
// mentorship request sent route -main
mentorshipRouter.get(
  "/mentorship/request/sent",
  authMiddleware,
  async (req: AuthenticatedRequest, res) => {
    try {
      const loggedInUser = req.user;
      if (!loggedInUser) {
        res.status(401).json({
          message: "Unauthorized",
        });
        return;
      }

      const mentorshipRequests = await mentorshipRequestModel
        .find({
          mentee: loggedInUser._id,
          status: "pending",
        })
        .populate(
          "mentor",
          "firstName lastName avatar bio skillsOffered experience email "
        );

      if (!mentorshipRequests) {
        res.status(404).json({
          message: "no mentorship request found",
        });
        return;
      }

      res.json({
        data: mentorshipRequests,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Request not found";
      res.status(401).json({ message: errorMessage });
    }
  }
);
//revoke a sent request -action
mentorshipRouter.delete(
  "/mentorship/request/revoke/:requestId",
  authMiddleware,
  async (req: AuthenticatedRequest, res) => {
    try {
      const loggedInUser = req.user;
      if (!loggedInUser) {
        res.status(401).json({
          message: "Unauthorized",
        });
        return;
      }
      const requestId = req.params.requestId;

      const mentorshipRequest = await mentorshipRequestModel.findOne({
        _id: requestId,
        mentee: loggedInUser._id,
        status: "pending",
      });
      if (!mentorshipRequest) {
        res.status(404).json({
          message: "mentorship request not found",
        });
        return;
      }
      await mentorshipRequest.deleteOne();
      res.status(200).json({
        message: "mentorship request revoked successfully",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      res.status(401).json({ message: errorMessage });
    }
  }
);

//group
//get all connections route -main
mentorshipRouter.get(
  "/mentorship/connections",
  authMiddleware,
  async (req: AuthenticatedRequest, res) => {
    try {
      const loggedInUser = req.user;
      if (!loggedInUser) {
        res.status(401).json({
          message: "Unauthorized",
        });
        return;
      }
      const connectionRequests = await mentorshipRequestModel
        .find({
          $or: [
            { mentor: loggedInUser._id, status: "accepted" },
            {
              mentee: loggedInUser._id,
              status: "accepted",
            },
          ],
        })
        .populate(
          "mentee",
          "firstName lastName avatar firstName lastName avatar bio skillsWanted experience email "
        )
        .populate(
          "mentor",
          "firstName avatar firstName lastName avatar bio skillsOffered experience email"
        );

      const data = connectionRequests
        .map((row) => {
          const menteeId = new mongoose.Types.ObjectId(
            (row.mentee as any)._id || row.mentee
          ).toString();
          const currentUserId = loggedInUser._id.toString();

          const otherUser =
            menteeId === currentUserId ? row.mentor : row.mentee;
          return {
            connectionId: row._id,
            userId: (otherUser as any)._id.toString(),
            user: otherUser,
          };
        })
        .filter(Boolean);
      res.status(200).json({
        data: data,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "No connections found!";
      res.status(401).json({ message: errorMessage });
    }
  }
);
// Terminate mentorship -action
mentorshipRouter.patch(
  "/mentorship/terminate/:mentorshipId",
  authMiddleware,
  async (req: AuthenticatedRequest, res) => {
    try {
      const loggedInUser = req.user;
      if (!loggedInUser) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const mentorshipId = req.params.mentorshipId;

      const mentorship = await mentorshipRequestModel.findOne({
        _id: mentorshipId,
        isActive: true,
      });

      if (!mentorship) {
        res
          .status(404)
          .json({ message: "Mentorship not found or already terminated" });
        return;
      }

      mentorship.isActive = false;
      mentorship.status = "terminated";
      await mentorship.save();

      res.status(200).json({
        message: "Mentorship terminated successfully",
        data: mentorship,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      res.status(500).json({ message: errorMessage });
    }
  }
);

export default mentorshipRouter;
