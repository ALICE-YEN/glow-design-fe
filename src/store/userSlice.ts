import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  isAuthModalOpen: boolean;
  hasInjectedTokenToAxios: boolean;
}

const initialState: UserState = {
  isAuthModalOpen: false,
  hasInjectedTokenToAxios: false,
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
    setHasInjectedTokenToAxios(state, action: PayloadAction<boolean>) {
      state.hasInjectedTokenToAxios = action.payload;
    },
  },
});

export const { openAuthModal, closeAuthModal, setHasInjectedTokenToAxios } =
  userSlice.actions;
export default userSlice.reducer;
