import mongoose, { Schema } from "mongoose";

export interface messageInterface {
  senderId: mongoose.Types.ObjectId;
  message: string;
  isSeen: boolean;
}

export interface chatInterface extends Document {
  participants: string[];
  messages: messageInterface[];
}
const messageSchema = new Schema<messageInterface>(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { type: String, required: true },
    isSeen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const chatSchema = new Schema<chatInterface>({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  messages: [messageSchema],
});

export const Chat = mongoose.model<chatInterface>("Chat", chatSchema);
