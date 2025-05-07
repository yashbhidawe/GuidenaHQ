import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  firstName: string;
  lastName: string;
  email: string;
  role: "mentor" | "mentee" | "both";
  experience: string;
  avatar: string;
  token?: string;
}

const initialState = null as UserState | null;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser(_state, action: PayloadAction<UserState>) {
      return action.payload;
    },
    removeUser() {
      return null;
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
