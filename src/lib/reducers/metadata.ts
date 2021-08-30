import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MediaMetadata {
  artist: string | undefined;
  album: string | undefined;
  title: string | undefined;
  image: string | undefined;
  year: number | undefined;
}

const initialState: MediaMetadata = {
  artist: undefined,
  album: undefined,
  title: undefined,
  image: undefined,
  year: undefined,
};

export const metadataSlice = createSlice({
  name: "metadata",
  initialState,
  reducers: {
    setMetadata: (state, action: PayloadAction<MediaMetadata>) => {
      state.title = action.payload.title;
      state.artist = action.payload.artist;
      state.album = action.payload.album;
      state.year = action.payload.year;
      state.image = "data:image/jpeg;base64," + action.payload.image;
    },
    resetMetadata: (state) => {
      state.artist = undefined;
      state.album = undefined;
      state.title = undefined;
      state.image = undefined;
      state.year = undefined;
    },
  },
});

export const { setMetadata, resetMetadata } = metadataSlice.actions;
export default metadataSlice.reducer;
