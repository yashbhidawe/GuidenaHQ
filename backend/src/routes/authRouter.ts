import Express from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validateSignupData } from "../utils/validator";
const authRouter = Express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, experience } = req.body;
    validateSignupData(req);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName: firstName.capitalize(),
      lastName: lastName.capitalize(),
      email,
      role: role.toLowerCase(),
      experience: experience.toLowerCase(),
      password: hashedPassword,
    });

    console.log(hashedPassword);
    const savedUser = await user.save();
    const token = await user.getJWT();
    console.log("token from signup ", token);
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
    console.log(user);

    if (!user) {
      throw new Error("User not found!");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid email or password");

    const token = await user.getJWT();
    console.log("generated token", token);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      message: "Loged in successfully",
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

export default authRouter;
