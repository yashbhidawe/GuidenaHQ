import { Request, Response, NextFunction } from "express";
import { User, UserInterface } from "../models/User";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user: UserInterface;
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      console.log("token not found");
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    const { _id } = decoded;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    (req as AuthenticatedRequest).user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unauthorized";
    res.status(401).json({ message: errorMessage });
  }
};

export default authMiddleware;
