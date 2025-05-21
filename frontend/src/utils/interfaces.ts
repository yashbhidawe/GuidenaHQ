export interface ChatMessage {
  senderId: string;
  firstName?: string;
  lastName?: string;
  message: string;
  timeStamp: string;
}

export interface RawMessage {
  senderId: {
    _id?: string;
    firstName?: string;
    lastName?: string;
  };
  message: string;
  createdAt?: string;
  timestamp?: string;
  timeStamp?: string;
}
