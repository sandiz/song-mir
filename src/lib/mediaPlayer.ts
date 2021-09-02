import { Colors } from "@blueprintjs/core";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min";
import CursorPlugin from "src/lib/wv-plugin/cursor";
import MinimapPlugin from "src/lib/wv-plugin/minimap";
import { WaveSurferParams } from "wavesurfer.js/types/params";
import { setMediaPlaybackState, MediaStatesEnum } from "./reducers/media";
import { store } from "./store";
import { ExtClasses, FONT_FAMILY } from "./types";
import { ERROR, getGradient, getGradientArray } from "./utils";

const COLORS = {
  TIMELINE: {
    primaryFontColorDark: Colors.WHITE,
    primaryFontColor: Colors.BLACK,
  },
  CHORDS: {
    primaryFontColorDark: Colors.WHITE,
    primaryFontColor: Colors.BLACK,
  },
};
class MediaPlayerSingleton {
  private static instance: MediaPlayerSingleton;
  private audioContext: AudioContext | null = null;
  public wavesurfer: WaveSurfer | null = null;

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
      waveColor: getGradientArray(darkMode ? "dark" : "light") as any, //TODO
      progressColor: ["#000000", "#434343"] as any, //TODO
      cursorColor: darkMode ? Colors.WHITE : Colors.BLACK,
      barWidth: 3,
      barRadius: 3,
      barGap: 2,
      height: 260,
      barHeight: 0.85,
      scrollParent: false,
      responsive: true,
      closeAudioContext: true,
      forceDecode: true,
      loopSelection: true,
      autoCenter: false,
      pixelRatio: 2,
      plugins: [
        TimelinePlugin.create({
          container: "#timeline",
          primaryColor: "#fff",
          primaryFontColor: darkMode
            ? COLORS.TIMELINE.primaryFontColorDark
            : COLORS.TIMELINE.primaryFontColor,
          secondaryFontColor: darkMode
            ? COLORS.TIMELINE.primaryFontColorDark
            : COLORS.TIMELINE.primaryFontColor,
          fontFamily: FONT_FAMILY.MONOSPACE,
          fontSize: 12,
          notchPercentHeight: 40,
        }),
        CursorPlugin.create({
          showTime: true,
          followCursorY: false,
          opacity: "1",
          width: "1px",
          color: darkMode ? Colors.WHITE : Colors.BLACK,
          customShowTimeStyle: {
            "background-color": "#000",
            color: "#fff",
            padding: "10px",
            "font-size": "14px",
            "font-family": FONT_FAMILY.MONOSPACE,
            visibility: "visible",
          },
          //extraOffset: 20 /* waveform-root has padding of 20px */,
        }),
        /*RegionsPlugin.create({
          dragSelection: true,
          regions: [],
          maxRegions: 20,
        }),
        MinimapPlugin.create({
          container: "#wave-minimap",
          waveColor: darkMode ? "#B7B7B7" : "#9D9C9E",
          progressColor: darkMode
            ? getGradient("dark", ctx)
            : getGradient("light", ctx),
          height: 40,
          showRegions: true,
          showOverview: true,
          overviewBorderColor: darkMode ? Colors.GRAY3 : Colors.DARK_GRAY3,
          overviewBorderSize: 1,
        }),*/
      ],
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

      this.wavesurfer?.on("finish", () => {
        store.dispatch(setMediaPlaybackState(MediaStatesEnum.PAUSED));
      });

      this.wavesurfer?.on("play", () => {
        this.wavesurfer?.drawer.recenter(
          this.wavesurfer?.getCurrentTime() / this.wavesurfer?.getDuration()
        );
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

  public getDuration = () => {
    return this.wavesurfer?.getDuration() || 0;
  };

  public getCurrentTime = (): number => {
    return this.wavesurfer?.getCurrentTime() || 0;
  };
}

const MediaPlayer = MediaPlayerSingleton.getInstance();
export default MediaPlayer;
