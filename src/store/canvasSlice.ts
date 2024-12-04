import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CanvasState {
  zoom: number;
  isCleared: boolean;
}

const initialState: CanvasState = {
  zoom: 1,
  isCleared: false,
};

const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    setZoom(state, action: PayloadAction<number>) {
      state.zoom = action.payload;
    },
    clearCanvas(state) {
      state.isCleared = true;
    },
    resetClearFlag(state) {
      state.isCleared = false;
    },
  },
});

export const { setZoom, clearCanvas, resetClearFlag } = canvasSlice.actions;
export default canvasSlice.reducer;
