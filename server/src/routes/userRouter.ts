import Express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import authMiddleware, { AuthenticatedRequest } from "../middleware/auth";
import { validateEditProfileData } from "../utils/validator";
const userRouter = Express.Router();

userRouter.get(
  "/profile",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await req.user;

      res.json(user);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "user not found";
      res.status(401).json({ message: errorMessage });
    }
  }
);

userRouter.patch(
  "/profile/edit",
  authMiddleware,
  async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user;

      const isEditAllowed = validateEditProfileData(req);
      if (!isEditAllowed) {
        throw new Error("Invalid updates");
      }

      Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));
      await user.save();
      res.json({ message: "Updated successfully", data: user });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "unable to edit";
      res.status(401).json({ message: errorMessage });
    }
  }
);

userRouter.patch(
  "/profile/update-password",
  authMiddleware,
  async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user;
      const { oldPassword, newPassword } = req.body;

      const isOldPasswordMatch = await bcrypt.compare(
        oldPassword,
        user?.password
      );

      if (!isOldPasswordMatch) {
        res.status(400).json({ message: "Make sure the passwords are same" });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user?.password = hashedPassword;
      await user?.save();
      res.status(200).json({ message: "password updated successfully" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "unable to edit";
      res.status(401).json({ message: errorMessage });
    }
  }
);

export default userRouter;
