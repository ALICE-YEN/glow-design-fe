import { configureStore } from "@reduxjs/toolkit";
import canvasReducer from "./canvasSlice";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    canvas: canvasReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
