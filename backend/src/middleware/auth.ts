import { Request, Response, NextFunction } from "express";
import { User, UserInterface } from "../models/User";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: UserInterface;
}

const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;

    // Debug log
    console.log("Request path:", req.path);
    console.log("Token exists:", !!token);

    if (!token) {
      throw new Error("Token not found");
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    console.log("Decoded token user ID:", decoded._id);

    const { _id } = decoded;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    console.log("User found in DB:", user._id);
    console.log("Current route params:", req.params);

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unauthorized";
    res.status(401).json({ message: errorMessage });
  }
};

export default authMiddleware;
