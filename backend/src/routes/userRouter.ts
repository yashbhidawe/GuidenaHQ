import Express, { Response } from "express";
import bcrypt from "bcrypt";
import authMiddleware, { AuthenticatedRequest } from "../middleware/auth";
import { validateEditProfileData } from "../utils/validator";
import { User } from "../models/User";
import mongoose from "mongoose";
import { createAuthHandler } from "../types/handlers";
import uploadProfilePicture from "../utils/uploadProfile";
import multer from "multer";
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const userRouter = Express.Router();

userRouter.get(
  "/profile",
  authMiddleware,
  createAuthHandler(async (req: AuthenticatedRequest, res: Response) => {
    try {
      const loggedInUser = req.user;

      if (!loggedInUser) {
        res.status(401).json({
          message: "User not authenticated",
        });
        return;
      }

      const userWithoutPassword = loggedInUser.toObject();
      delete userWithoutPassword.password;

      res.json({
        message: "Current user found",
        data: userWithoutPassword,
        isOwnProfile: true,
      });
    } catch (error) {
      console.error("Current user profile fetch error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch user profile";

      res.status(500).json({
        message: errorMessage,
      });
    }
  })
);

userRouter.get(
  "/profile/:id",
  authMiddleware,
  createAuthHandler(async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.params.id;
      const loggedInUser = req.user;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({
          message: "Invalid user ID format",
        });
        return;
      }

      const userProfile = await User.findById(userId).select("-password");

      if (!userProfile) {
        res.status(404).json({
          message: "User not found",
        });
        return;
      }

      const isOwnProfile = loggedInUser?._id.equals(
        new mongoose.Types.ObjectId(userId)
      );

      res.json({
        message: "User found",
        data: userProfile,
        isOwnProfile,
      });
    } catch (error) {
      console.error("Profile fetch error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch user profile";

      res.status(500).json({
        message: errorMessage,
      });
    }
  })
);

userRouter.patch(
  "/profile/edit",
  authMiddleware,
  upload.single("avatar"),
  createAuthHandler(async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user;

      if (!user) {
        res.status(401).json({
          message: "User not authenticated",
        });
        return;
      }

      const isEditAllowed = validateEditProfileData(req);
      if (!isEditAllowed) {
        throw new Error("Invalid updates");
      }

      interface UserUpdates {
        firstName?: string;
        lastName?: string;
        email?: string;
        bio?: string;
        avatar?: string;
        experience?: string;
        skillsOffered?: string[];
        skillsWanted?: string[];
      }

      const updates = req.body as UserUpdates;

      if (req.file) {
        try {
          const avatarUrl = await uploadProfilePicture(req.file);
          updates.avatar = avatarUrl;
        } catch (uploadError) {
          console.error("Profile picture upload failed:", uploadError);
          res.status(500).json({
            message: "Profile picture upload failed",
            error:
              uploadError instanceof Error
                ? uploadError.message
                : "Unknown error",
          });
          return;
        }
      }

      (Object.keys(updates) as Array<keyof UserUpdates>).forEach((key) => {
        if (key in user) {
          (user as any)[key] = updates[key];
        }
      });

      const response = await user.save();
      res.json({ message: "Updated successfully", data: response });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "unable to edit";
      res.status(500).json({ message: errorMessage });
    }
  })
);

userRouter.patch(
  "/profile/update-password",
  authMiddleware,
  createAuthHandler(async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({
          message: "User not authenticated",
        });
        return;
      }
      if (user.googleId && !user.password) {
        throw new Error("Please sign in with Google");
      }

      if (!user.password) {
        throw new Error("Invalid login method");
      }
      const { oldPassword, newPassword } = req.body;

      const isOldPasswordMatch = await bcrypt.compare(
        oldPassword,
        user.password
      );

      if (!isOldPasswordMatch) {
        res.status(400).json({ message: "Make sure the passwords are same" });
        return;
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user?.save();
      res.status(200).json({ message: "password updated successfully" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "unable to edit";
      res.status(401).json({ message: errorMessage });
    }
  })
);

export default userRouter;
