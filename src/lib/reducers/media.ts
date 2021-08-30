import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum MediaStatesEnum {
  PLAYING = "playing",
  PAUSED = "paused",
  LOADING = "loading",
}

export interface MediaState {
  state: MediaStatesEnum;
}

const initialState: MediaState = {
  state: MediaStatesEnum.PAUSED,
};

export const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    setMediaPlaybackState: (state, action: PayloadAction<MediaStatesEnum>) => {
      state.state = action.payload;
    },
  },
});

export const { setMediaPlaybackState } = mediaSlice.actions;
export default mediaSlice.reducer;
