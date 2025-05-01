// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import tabsReducer from "./features/tabs/tabsSlice";
import uiReducer from "./features/ui/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tabs: tabsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["auth/initKeycloak/fulfilled"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["payload.user"],
        // Ignore these paths in the state
        ignoredPaths: ["auth.user"],
      },
    }),
});