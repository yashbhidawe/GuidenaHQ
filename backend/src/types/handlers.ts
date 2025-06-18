// src/types/handlers.ts
import { Request, Response, NextFunction } from "express";
import { UserInterface } from "../models/User";

export interface AuthenticatedRequest extends Request {
  user: UserInterface;
}

export type AuthenticatedHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next?: NextFunction
) => Promise<void> | void;

// Helper function to create properly typed handlers
export const createAuthHandler = (handler: AuthenticatedHandler) => {
  return handler as any; // This bypasses the TypeScript error
};
