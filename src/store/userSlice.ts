import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  username: string;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
}

const initialState: UserState = {
  username: "",
  isLoggedIn: false,
  isAuthModalOpen: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action: PayloadAction<string>) {
      state.username = action.payload;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.username = "";
      state.isLoggedIn = false;
    },
    openAuthModal: (state) => {
      state.isAuthModalOpen = true;
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
  },
});

export const { login, logout, openAuthModal, closeAuthModal } =
  userSlice.actions;
export default userSlice.reducer;
