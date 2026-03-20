import { app, widgetWindow, addon } from "novadesk";

const widget = new widgetWindow({
  id: "audio-visualizer",
  width: 600,
  height: 400,
  backgroundColor: "rgba(30, 30, 40, 0.9)",
  script: "ui/script.ui.js"
});

const audioLevel = addon.load(
  "D:\\Novadesk-Project\\AudioLevel\\dist\\x64\\Debug\\AudioLevel\\AudioLevel.dll"
);

const statsOptions = {
  port: "output",
  fftSize: 1024,
  fftOverlap: 512,
  bands: 20,
  rmsGain: 120,
  fftAttack: 50,
  fftDecay: 200,
  sensitivity: 100
};

function pushAudio() {
  const data = audioLevel.stats(statsOptions);
  if (data) {
    ipcMain.send("audio-data", data);
  }
}

pushAudio();
const timer = setInterval(() => {
  pushAudio();
}, 33);

widget.on("close", function () {
  if (timer) clearInterval(timer);
});

app.useHardwareAcceleration(true);
