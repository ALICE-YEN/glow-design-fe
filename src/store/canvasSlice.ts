import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CanvasAction } from "@/types/enum";

interface CanvasState {
  currentAction: CanvasAction;
  zoom: number;
}

const initialState: CanvasState = {
  currentAction: CanvasAction.NONE,
  zoom: 1,
};

const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    setAction(state, action: PayloadAction<CanvasAction>) {
      state.currentAction = action.payload;
    },
    resetAction(state) {
      state.currentAction = CanvasAction.NONE; // 重置操作为无
    },
    setZoom(state, action: PayloadAction<number>) {
      state.zoom = action.payload;
    },
  },
});

export const { setAction, resetAction, setZoom } = canvasSlice.actions;
export default canvasSlice.reducer;
