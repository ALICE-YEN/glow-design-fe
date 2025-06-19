import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  isAuthModalOpen: boolean;
}

const initialState: UserState = {
  isAuthModalOpen: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    openAuthModal: (state) => {
      state.isAuthModalOpen = true;
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
  },
});

export const { openAuthModal, closeAuthModal } = userSlice.actions;
export default userSlice.reducer;
