import { configureStore } from "@reduxjs/toolkit";
import listingsReducer from "./features/listingsSlice";
import authReducer from "./features/authSlice";

export const store = configureStore({
  reducer: {
    listings: listingsReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
