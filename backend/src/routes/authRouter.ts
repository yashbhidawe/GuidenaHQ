import Express from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import { validateSignupData } from "../utils/validator";
import lodash from "lodash";
import passport from "passport";
import { AuthenticatedRequest } from "../middleware/auth";
import { createAuthHandler } from "../types/handlers";
import { BASE_URL } from "../utils/constants";
import multer from "multer";
import cloudinary from "../config/cloudinary";
import { UploadApiErrorResponse, UploadResponseCallback } from "cloudinary";

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
      const result = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: "profile_pictures",
                transformation: [
                  { width: 400, height: 400, crop: "fill" },
                  { quality: "auto" },
                  { format: "auto" },
                ],
              },
              (error, result) => {
                if (error) reject(error);
                if (!result || !("secure_url" in result)) {
                  return reject(new Error("upload failed"));
                }

                resolve(result as { secure_url: string });
              }
            )
            .end(req.file?.buffer);
        }
      );

      profilePictureUrl = result.secure_url;
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
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ message: "User created successfully", data: savedUser });
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

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: user,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Invalid email or password!";
    res.status(401).json({ message: errorMessage });
  }
});

authRouter.post("/logout", async (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .send("logged out successfully");
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

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      console.log("Redirecting to:", `${BASE_URL}`); // Debug log

      res.redirect(`${BASE_URL}`);

      // Alternative: Send JSON response for API clients
      // res.status(200).json({
      //   success: true,
      //   message: "Google authentication successful",
      //   data: req.user,
      //   token: token,
      // });
    } catch (error) {
      console.error("Google auth callback error:", error);
      res.redirect("/login?error=auth_processing_failed");
    }
  })
);

export default authRouter;
