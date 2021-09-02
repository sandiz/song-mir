import * as musicMetadata from "music-metadata-browser";
import MediaPlayer from "./mediaPlayer";
import { setMediaPlaybackState, MediaStatesEnum } from "./reducers/media";
import { store } from "./store";
import { DEBUG, ERROR, INFO } from "./utils";
import { setMetadata } from "./reducers/metadata";
import { createTempProject } from "./projectUtils";

export async function importLocalFile() {
  if (window.isSecureContext) {
    const pickerOpts = {
      types: [
        {
          description: "Media file",
          accept: {
            "audio/*": [".mp3", ".wav", ".ogg"],
          },
        },
      ],
      excludeAcceptAllOption: true,
      multiple: false,
    };
    try {
      const [fileHandle] = await window.showOpenFilePicker(pickerOpts);
      const blob = await fileHandle.getFile();

      store.dispatch(setMediaPlaybackState(MediaStatesEnum.LOADING));
      DEBUG("loading file:", fileHandle.name);
      await MediaPlayer.loadMediaBlob(blob);

      store.dispatch(setMediaPlaybackState(MediaStatesEnum.PAUSED));

      const metadata = await musicMetadata.parseBlob(blob);
      const { title, artist, album, year, picture = [] } = metadata.common;

      let image = "";
      if (Array.isArray(picture) && picture.length > 0) {
        image = picture[0].data.toString("base64");
      }

      store.dispatch(setMetadata({ title, artist, album, year, image }));
      DEBUG("metadata object", metadata);
      INFO("media loaded succesfully", fileHandle.name);
      INFO("song: %s album: %s artist: %s", title, album, artist);

      createTempProject();
    } catch (ex) {
      ERROR("importLocalFile", "failed to import file", ex);
    }
  } else {
    ERROR("importLocalFile", "failed to get secure context, import disabled");
  }
}
