import express from "express";
import authMiddleware, { AuthenticatedRequest } from "../middleware/auth";
import { User, UserInterface } from "../models/User";
import { mentorshipRequestModel } from "../models/Mentorship";

const feedRouter = express.Router();

feedRouter.get(
  "/teach",
  authMiddleware,
  async (req: AuthenticatedRequest, res) => {
    try {
      const loggedInUser = req.user as UserInterface;
      if (!loggedInUser) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const teachersFeed = await User.find({
        role: { $in: ["mentee", "both"] },
        skillsWanted: { $in: loggedInUser.skillsOffered },
        _id: { $ne: loggedInUser._id },
      }).select("-password");

      console.log("teachersFeed", teachersFeed);
      if (!teachersFeed) {
        res.status(404).json({
          message: "no mentorship request found",
        });
        return;
      }

      res.status(200).json({
        message: "learners who need your help",
        data: teachersFeed,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "cannot get feed";
      res.status(401).json({ message: errorMessage });
    }
  }
);

feedRouter.get(
  "/learn",
  authMiddleware,
  async (req: AuthenticatedRequest, res) => {
    try {
      const loggedInUser = req.user as UserInterface;
      if (!loggedInUser) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const learnersFeed = await User.find({
        role: { $in: ["mentor", "both"] },
        skillsOffered: { $in: loggedInUser.skillsWanted },
        _id: { $ne: loggedInUser._id },
      }).select("-password");

      res.status(200).json({
        message: "teachers who can help you",
        data: learnersFeed,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "cannot get feed";
      res.status(401).json({ message: errorMessage });
    }
  }
);

feedRouter.get(
  "/both",
  authMiddleware,
  async (req: AuthenticatedRequest, res) => {
    try {
      const loggedInUser = req.user as UserInterface;
      if (!loggedInUser) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const potentialMentors = await User.find({
        role: { $in: ["mentor", "both"] },
        skillsOffered: { $in: loggedInUser.skillsWanted },
        _id: { $ne: loggedInUser._id },
      }).select("-password");

      const potentialMentees = await User.find({
        role: { $in: ["mentee", "both"] },
        skillsWanted: { $in: loggedInUser.skillsOffered },
        _id: { $ne: loggedInUser._id },
      }).select("-password");

      // const existingConnection = await mentorshipRequestModel.findOne({
      //   $or: [
      //     { menteeId: menteeId, mentorId: mentorId },
      //     { menteeId: mentorId, mentorId: menteeId },
      //   ],
      // });
      // if (existingConnection) {
      //   res.status(400).json({
      //     message: "conncetion already exists",
      //   });
      //   return;
      // }
      const combinedFeed = {
        mentors: potentialMentors.map((user) => ({
          ...user.toObject(),
          relationshipType: "mentor",
        })),
        mentees: potentialMentees.map((user) => ({
          ...user.toObject(),
          relationshipType: "mentee",
        })),
      };

      res.status(200).json({
        message: "Your personalized feed for mentoring and learning",
        data: combinedFeed,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "cannot get feed";
      res.status(401).json({ message: errorMessage });
    }
  }
);

export default feedRouter;
