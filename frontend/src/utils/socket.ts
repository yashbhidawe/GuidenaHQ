import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  try {
    return io(BASE_URL, {
      path: "/socket.io",
    });
  } catch (error) {
    console.error("socket connection error:", error);
    return null;
  }
};
