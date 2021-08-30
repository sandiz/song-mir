export const sec2time = (timeInSeconds: number, withMS = false) => {
  const pad = (num: number, size: number) => {
    return ("000" + num).slice(size * -1);
  };
  const time: number = parseFloat(timeInSeconds.toString());
  const minutes = Math.floor(time / 60) % 60;
  const seconds = Math.floor(time - minutes * 60);
  const milliseconds = parseInt(time.toString().slice(-3), 10);

  if (withMS)
    return pad(minutes, 2) + ":" + pad(seconds, 2) + "." + pad(milliseconds, 3);
  else return pad(minutes, 2) + ":" + pad(seconds, 2);
};

export const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

const DEBUGFLAG = true && process.env.NODE_ENV === "development";
const lighter = "color: gray; font-weight: lighter; ";
const bold = "color: white; font-weight: bold";
const error = "color: #F20404; font-weight: bold";
const warn = "color: #E7AE47; font-weight: bold";
const info = "color: #03A9F4; font-weight: lighter";

export const DEBUG = (msg: any, ...rest: any[]) =>
  DEBUGFLAG && console.log(`%c debug %c ${msg}`, lighter, bold, ...rest);
export const INFO = (msg: any, ...rest: any[]) =>
  console.log(`%c info %c ${msg}`, info, bold, ...rest);
export const WARN = (msg: any, ...rest: any[]) =>
  console.warn(`%c warn %c ${msg}`, warn, bold, ...rest);
export const ERROR = (msg: any, ...rest: any[]) =>
  console.error(`%c error %c ${msg}`, error, bold, ...rest);

export const getGradient = (type: string, ctx: CanvasRenderingContext2D) => {
  switch (type) {
    case "dark":
      const linGradDark = ctx.createLinearGradient(0, 155, 0, 200);
      linGradDark.addColorStop(0.5, "rgba(255, 255, 255, 1.000)");
      linGradDark.addColorStop(0.5, "rgba(183, 183, 183, 1.000)");
      return linGradDark;
    default:
      const linGrad = ctx.createLinearGradient(0, 155, 0, 200);
      linGrad.addColorStop(0.5, "rgba(0, 0, 0, 1.000)");
      linGrad.addColorStop(0.5, "rgba(72, 72, 72, 1.000)");
      return linGrad;
  }
};