import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProjectState {
  loaded: boolean;
}

const initialState: ProjectState = {
  loaded: true,
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProjectState: (state, action: PayloadAction<Partial<ProjectState>>) => {
      state.loaded = action.payload.loaded || false;
    },
  },
});

export const { setProjectState } = projectSlice.actions;
export default projectSlice.reducer;
