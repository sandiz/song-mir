import MediaPlayer from "./mediaPlayer";
import { resetMetadata } from "./reducers/metadata";
import { setProjectState } from "./reducers/project";
import { store } from "./store";

export function closeProject() {
  MediaPlayer.unloadMedia();
  store.dispatch(resetMetadata());
  store.dispatch(
    setProjectState({
      loaded: false,
    })
  );
}

export function createTempProject() {
  store.dispatch(
    setProjectState({
      loaded: true,
    })
  );
}