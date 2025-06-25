import validator from "validator";
import bcrypt from "bcrypt";
import { Request } from "express";
import { AuthenticatedRequest } from "../middleware/auth";

export const validateSignupData = (req: Request) => {
  const {
    firstName,
    lastName,
    email,
    role,
    password,
    skillsOffered,
    skillsWanted,
  } = req.body;

  if (!firstName || !lastName || !email || !password || !role) {
    throw new Error("All fields are required");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }
  if (firstName.length < 3 || firstName.length > 50) {
    throw new Error(
      "First name should be atleast 3 characters long and at max 50 characters long"
    );
  }
  if (skillsOffered.length < 1 || skillsOffered.length > 10) {
    throw new Error("Skills offered should be between 1 and 10 skills");
  }
  if (skillsWanted.length < 1 || skillsWanted.length > 10) {
    throw new Error("Skills wanted should be between 1 and 10 skills");
  }
};

export const validateEditProfileData = (req: AuthenticatedRequest) => {
  const allowedEdits = [
    "firstName",
    "lastName",
    "avatar",
    "experience",
    "skillsOffered",
    "skillsWanted",
    "bio",
    "role",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEdits.includes(field)
  );
  return isEditAllowed;
};
