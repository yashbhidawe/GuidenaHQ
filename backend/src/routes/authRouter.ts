import Express from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import { validateSignupData } from "../utils/validator";
import lodash from "lodash";
import passport from "passport";
import authMiddleware, { AuthenticatedRequest } from "../middleware/auth";
import { createAuthHandler } from "../types/handlers";
import { BASE_URL } from "../utils/constants";
import multer from "multer";
import cloudinary from "../config/cloudinary";
import { UploadApiErrorResponse, UploadResponseCallback } from "cloudinary";
import uploadProfilePicture from "../utils/uploadProfile";

const authRouter = Express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload only images.") as any, false);
    }
  },
});

authRouter.post("/signup", upload.single("avatar"), async (req, res) => {
  try {
    let {
      firstName,
      lastName,
      email,
      password,
      role,
      experience,
      skillsOffered,
      skillsWanted,
    } = req.body;

    if (typeof skillsOffered === "string") {
      try {
        skillsOffered = JSON.parse(skillsOffered);
      } catch {
        skillsOffered = [];
      }
    }
    if (typeof skillsWanted === "string") {
      try {
        skillsWanted = JSON.parse(skillsWanted);
      } catch {
        skillsWanted = [];
      }
    }
    req.body.skillsOffered = skillsOffered;
    req.body.skillsWanted = skillsWanted;
    validateSignupData(req);

    let profilePictureUrl = null;

    if (req.file) {
      try {
        profilePictureUrl = await uploadProfilePicture(req.file);
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        res.status(500).json({
          message: "Error uploading profile picture",
          error: error instanceof Error ? error.message : "Unknown error",
        });
        return;
      }
      console.log("ProfileURL", profilePictureUrl);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName: lodash.capitalize(firstName),
      lastName: lodash.capitalize(lastName),
      role: lodash.toLower(role),
      experience: lodash.toLower(experience),
      email: lodash.toLower(email),
      password: hashedPassword,
      avatar: profilePictureUrl,
      skillsOffered: skillsOffered.map((skill: string) =>
        lodash.toLower(skill.trim())
      ),
      skillsWanted: skillsWanted.map((skill: string) =>
        lodash.toLower(skill.trim())
      ),
    });

    const savedUser = await user.save();
    const token = savedUser.getJWT();

    res.json({
      message: "User created successfully",
      data: savedUser,
      token: token,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Something went wrong while signing up";
    res.status(401).json({ message: errorMessage });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found!");
    }

    if (user.googleId && !user.password) {
      throw new Error("Please sign in with Google");
    }

    if (!user.password) {
      throw new Error("Invalid login method");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid email or password");

    const token = user.getJWT();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: user,
      token: token,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Invalid email or password!";
    res.status(401).json({ message: errorMessage });
  }
});

authRouter.post("/logout", authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Logout failed" });
  }
});

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

authRouter.get(
  "/google/redirect",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login?error=auth_failed",
    scope: ["profile", "email"],
  }),

  createAuthHandler(async (req: AuthenticatedRequest, res) => {
    try {
      const token = req.user.getJWT();
      console.log("Generated token for redirect:", token);
      console.log("Redirecting to:", `${BASE_URL}?token=${token}`);
      res.redirect(`${BASE_URL}?token=${token}`);
    } catch (error) {
      console.error("Google auth callback error:", error);
      res.redirect("/login?error=auth_processing_failed");
    }
  })
);

export default authRouter;
