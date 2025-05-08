import Express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import authMiddleware, { AuthenticatedRequest } from "../middleware/auth";
import { validateEditProfileData } from "../utils/validator";
const userRouter = Express.Router();

userRouter.get("/profile/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await req.app.locals.UserModel.findById(userId).select(
      "-password"
    );
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json({ message: "User found", data: user });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "unable to edit";
    res.status(401).json({ message: errorMessage });
  }
});

userRouter.patch(
  "/profile/edit",
  authMiddleware,
  async (req: AuthenticatedRequest, res) => {
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

      (Object.keys(updates) as Array<keyof UserUpdates>).forEach((key) => {
        if (key in user) {
          (user as any)[key] = updates[key];
        }
      });

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
      if (!user) {
        res.status(401).json({
          message: "User not authenticated",
        });
        return;
      }
      const { oldPassword, newPassword } = req.body;

      const isOldPasswordMatch = await bcrypt.compare(
        oldPassword,
        user.password
      );

      if (!isOldPasswordMatch) {
        res.status(400).json({ message: "Make sure the passwords are same" });
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
  }
);

export default userRouter;
