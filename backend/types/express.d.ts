import { UserInterface } from "../src/models/User";

declare global {
  namespace Express {
    interface User extends UserInterface {}

    interface Request {
      user: UserInterface;
    }
  }
}
