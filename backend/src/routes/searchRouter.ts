import express from "express";
import authMiddleware from "../middleware/auth";
import { User, UserInterface } from "../models/User";

const searchRouter = express.Router();

searchRouter.get("/search/:query", authMiddleware, async (req, res) => {
  try {
    const loggedInUser = req.user as UserInterface;
    if (!loggedInUser) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const query = req.params.query;

    const searchResults = await User.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { skillsOffered: { $regex: query, $options: "i" } },
        { skillsWanted: { $regex: query, $options: "i" } },
      ],
      _id: { $ne: loggedInUser._id },
    }).select("-password");

    if (searchResults.length === 0) {
      res.status(404).json({ message: "No results found" });
      return;
    }

    res.status(200).json({
      message: `Search results for "${query}"`,
      data: searchResults,
    });
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default searchRouter;
