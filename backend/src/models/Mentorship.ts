import mongoose, { Schema, Document } from "mongoose";

export interface MentorshipInterface extends Document {
  mentee: mongoose.Types.ObjectId; // learner
  mentor: mongoose.Types.ObjectId; // teacher
  pitchMessage: string;
  status: "pending" | "accepted" | "rejected" | "terminated";
  isActive: boolean;
  feedback: string;
  createdAt: Date;
}

const mentorshipSchema = new Schema<MentorshipInterface>(
  {
    mentee: { type: Schema.Types.ObjectId, ref: "User", required: true },
    mentor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    pitchMessage: {
      type: String,
      required: true,
      maxlength: 500,
      default:
        "Hey there! How is it going, I would love to menotor you/get mentored by you! thanks.",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "terminated"],
      default: "pending",
    },
    isActive: { type: Boolean, default: true },
    feedback: { type: String, default: "", maxlength: 500 },
  },
  { timestamps: true }
);

export const mentorshipRequestModel = mongoose.model<MentorshipInterface>(
  "Mentorship",
  mentorshipSchema
);
