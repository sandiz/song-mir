import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UIState {
  darkMode: boolean;
  dialog: {
    state: "opening" | "open" | "closing" | "closed";
    id: string | null;
  };
}

const initialState: UIState = {
  darkMode: false,
  dialog: {
    state: "closed",
    id: null,
  },
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
    setDialog: (state, action: PayloadAction<string>) => {
      state.dialog = {
        id: action.payload,
        state: "opening",
      };
    },
  },
});

export const { setDarkMode } = uiSlice.actions;
export default uiSlice.reducer;
