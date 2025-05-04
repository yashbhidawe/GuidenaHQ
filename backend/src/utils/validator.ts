import validator from "validator";
import bcrypt from "bcrypt";
import { Request } from "express";

export const validateSignupData = (req: Request) => {
  const { firstName, lastName, email, role, password } = req.body;

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
};

export const validateEditProfileData = (req) => {
  const allowedEdits = [
    "firstName",
    "lastName",
    "avtar",
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
