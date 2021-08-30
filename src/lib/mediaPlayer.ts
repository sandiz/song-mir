import { Colors } from "@blueprintjs/core";
import WaveSurfer from "wavesurfer.js";
import { WaveSurferParams } from "wavesurfer.js/types/params";
import { setMediaPlaybackState, MediaStatesEnum } from "./reducers/media";
import { store } from "./store";
import { ExtClasses } from "./types";
import { ERROR, getGradient } from "./utils";

class MediaPlayerSingleton {
  private static instance: MediaPlayerSingleton;
  private audioContext: AudioContext | null = null;
  private wavesurfer: WaveSurfer | null = null;

  static getInstance() {
    if (!MediaPlayerSingleton.instance) {
      MediaPlayerSingleton.instance = new MediaPlayerSingleton();
    }
    return MediaPlayerSingleton.instance;
  }

  public loadMediaBlob = async (blob: File) => {
    this.audioContext = new AudioContext({
      latencyHint: "interactive",
      sampleRate: 44100,
    });
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) {
      ERROR("getContext failed", "unable to create canvas context");
      return;
    }
    const { darkMode } = store.getState().ui;
    const params: WaveSurferParams = {
      audioContext: this.audioContext,
      backgroundColor: darkMode
        ? ExtClasses.DARK_BACKGROUND_COLOR
        : ExtClasses.BACKGROUND_COLOR,
      container: "#waveform",
      waveColor: getGradient(darkMode ? "dark" : "light", ctx),
      //progressColor: getGradient(darkMode ? "dark" : "light", ctx) as any,
      cursorColor: darkMode ? Colors.WHITE : Colors.BLACK,
      barWidth: 3,
      barRadius: 3,
      barGap: 2,
      height: 180,
      barHeight: 0.85,
      scrollParent: false,
      responsive: true,
      closeAudioContext: true,
      forceDecode: true,
      loopSelection: true,
      autoCenter: false,
      pixelRatio: 2,
    };
    this.wavesurfer = WaveSurfer.create(params);
    this.wavesurfer.loadBlob(blob);

    return new Promise((resolve, reject) => {
      this.wavesurfer?.on("ready", () => {
        resolve(true);
      });

      this.wavesurfer?.on("error", (msg) => {
        ERROR("loadBlob failed", "unable to load media");
        reject(new Error(msg));
      });
    });
  };

  public pause = async () => {
    this.wavesurfer?.pause();
    store.dispatch(setMediaPlaybackState(MediaStatesEnum.PAUSED));
  };

  public play = async () => {
    this.wavesurfer?.play();
    store.dispatch(setMediaPlaybackState(MediaStatesEnum.PLAYING));
  };

  public playPause = async () => {
    await this.wavesurfer?.playPause();

    store.dispatch(
      setMediaPlaybackState(
        this.wavesurfer?.isPlaying()
          ? MediaStatesEnum.PLAYING
          : MediaStatesEnum.PAUSED
      )
    );
  };

  public seekTo = (num: number): void => {
    this.wavesurfer?.seekTo(num);
  };

  public rewind = (num = 5): void => {
    this.wavesurfer?.skipBackward(num);
  };

  public ffwd = (num = 5): void => {
    this.wavesurfer?.skipForward(num);
  };

  public unloadMedia = async () => {
    this.pause();
    this.wavesurfer?.destroy();
    this.wavesurfer = null;
    this.audioContext = null;
  };
}

const MediaPlayer = MediaPlayerSingleton.getInstance();
export default MediaPlayer;
