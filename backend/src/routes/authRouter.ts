import Express from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import { validateSignupData } from "../utils/validator";
import lodash from "lodash";
import passport from "passport";
import authMiddleware, { AuthenticatedRequest } from "../middleware/auth";
import { createAuthHandler } from "../types/handlers";

const authRouter = Express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, experience } = req.body;
    validateSignupData(req);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName: lodash.capitalize(firstName),
      lastName: lodash.capitalize(lastName),
      role: lodash.toLower(role),
      experience: lodash.toLower(experience),
      email: lodash.toLower(email),
      password: hashedPassword,
    });

    const savedUser = await user.save();
    const token = savedUser.getJWT();
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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
      secure: process.env.NODE_ENV === "production",
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
      secure: process.env.NODE_ENV === "production",
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
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // res.redirect(`${BASE_URL || "http://localhost:3000"}`);

      // Alternative: Send JSON response for API clients
      res.status(200).json({
        success: true,
        message: "Google authentication successful",
        data: req.user,
        token: token,
      });
    } catch (error) {
      console.error("Google auth callback error:", error);
      res.redirect("/login?error=auth_processing_failed");
    }
  })
);

export default authRouter;
