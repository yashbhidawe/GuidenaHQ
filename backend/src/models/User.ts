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
  password: string;
  role: "mentor" | "mentee" | "both";
  exprience: string;
  skillsOffered?: string[];
  skillsWanted?: string[];
  bio?: string;
  avatar?: string;
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
      required: true,
      validate(value: string) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("invalid password");
        }
      },
    },
    role: {
      type: String,
      enum: ["mentor", "mentee", "both"],
      default: "mentee",
      required: true,
    },
    exprience: {
      type: String,
    },
    skillsOffered: [{ type: String }],
    skillsWanted: [{ type: String }],
    bio: { type: String },
    avatar: {
      type: String,
      default: "https://avatar.iran.liara.run/public/boy?username=Ash",
    },
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
