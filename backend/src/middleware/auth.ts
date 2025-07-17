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
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Authorization header not found or invalid format");
      res.status(401).json({
        message: "Access denied. No token provided.",
      });
      return;
    }

    const token = authHeader.substring(7);

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
    let errorMessage = "Unauthorized";

    if (error instanceof jwt.JsonWebTokenError) {
      errorMessage = "Invalid token";
    } else if (error instanceof jwt.TokenExpiredError) {
      errorMessage = "Token expired";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(401).json({ message: errorMessage });
    return;
  }
};

export default authMiddleware;
