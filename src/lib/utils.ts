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
