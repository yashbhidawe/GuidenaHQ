import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "mentor" | "mentee" | "both";
  experience: string;
  skillsOffered: string[];
  skillsWanted: string[];
  bio: string;
  avatar: string;
  token?: string;
}

export interface UserState {
  data: UserData;
  isLoggedIn: boolean;
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
    getUser(state) {
      return state;
    },
    updateUser(state, action: PayloadAction<Partial<UserState>>) {
      if (state) {
        return { ...state, ...action.payload };
      }
      return state;
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
