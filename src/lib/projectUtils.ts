import MediaPlayer from "./mediaPlayer";
import { resetMetadata } from "./reducers/metadata";
import { store } from "./store";

export function closeProject() {
  MediaPlayer.unloadMedia();
  store.dispatch(resetMetadata());
}
