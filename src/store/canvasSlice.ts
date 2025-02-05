import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CanvasAction } from "@/types/enum";

interface CanvasState {
  currentAction: CanvasAction;
  selectedImage: string | null; // 儲存圖片的 URL 或其他格式
}

const initialState: CanvasState = {
  currentAction: CanvasAction.NONE,
  selectedImage: null,
};

const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    setAction(state, action: PayloadAction<CanvasAction>) {
      state.currentAction = action.payload;
    },
    resetAction(state) {
      state.currentAction = CanvasAction.NONE;
    },
    setSelectedImage(state, action: PayloadAction<string | null>) {
      state.selectedImage = action.payload;
    },
  },
});

export const { setAction, resetAction, setSelectedImage } = canvasSlice.actions;
export default canvasSlice.reducer;
