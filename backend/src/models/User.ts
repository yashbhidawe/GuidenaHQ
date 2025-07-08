import { Schema, model, Document } from "mongoose";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
export interface UserInterface extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName?: string;
  email: string;
  password?: string;
  role: "mentor" | "mentee" | "both";
  experience: string;
  skillsOffered?: string[];
  skillsWanted?: string[];
  bio?: string;
  avatar?: string;
  userRating?: number;
  googleId?: string;
  getJWT(): string;
}

const userSchema = new Schema<UserInterface>(
  {
    firstName: { type: String, required: true, minlength: 3, maxlength: 50 },
    lastName: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid password");
        }
      },
    },
    password: {
      type: String,
      validate(value: string) {
        if (value && !validator.isStrongPassword(value)) {
          throw new Error("invalid password");
        }
      },
    },
    role: {
      type: String,
      enum: ["mentor", "mentee", "both"],
      default: "both",
      required: true,
    },
    experience: {
      type: String,
      default: "",
    },
    skillsOffered: {
      type: [String],
      default: [],
      set: (arr: string[]) => arr.map((s) => s.toLowerCase()),
    },
    skillsWanted: {
      type: [String],
      default: [],
      set: (arr: string[]) => arr.map((s) => s.toLowerCase()),
    },
    bio: { type: String, default: "" },
    avatar: {
      type: String,
      default: "https://avatar.iran.liara.run/public/boy?username=Ash",
    },
    userRating: { type: Number, default: 0 },
    googleId: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};

userSchema.methods.isPasswordValid = async function (
  userInputPassword: string
) {
  const user = this;
  const isMatch = await bcrypt.compare(userInputPassword, user.password);
  return isMatch;
};

export const User = model<UserInterface>("User", userSchema);
