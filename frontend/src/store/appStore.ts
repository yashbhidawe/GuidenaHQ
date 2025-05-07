import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./slices/userSlice";
export const appStore = configureStore({
  reducer: {
    user: userSlice,
  },
});

export type RootState = ReturnType<typeof appStore.getState>;

export type AppDispatch = typeof appStore.dispatch;
