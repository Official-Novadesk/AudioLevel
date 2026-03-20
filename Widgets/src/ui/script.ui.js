var bandCount = 24;
var width = 600;
var height = 400;
var barGap = 6;
var barWidth = 14;
var maxBarHeight = 220;
var floorY = 320;

var bars = [];
var caps = [];

for (var i = 0; i < bandCount; i++) {
  var x = 40 + i * (barWidth + barGap);

  ui.addBar({
    id: "bar_" + i,
    x: x,
    y: floorY,
    width: barWidth,
    height: 1,
    value: 1,
    barColor: "linearGradient(180deg, #1BD8FF, #00FF6A)",
    backgroundColor: "rgba(40, 40, 50, 0.6)"
  });
  bars.push("bar_" + i);

  ui.addShape({
    type: "rectangle",
    id: "cap_" + i,
    x: x,
    y: floorY - 6,
    width: barWidth,
    height: 4,
    radius: 2,
    fillColor: "#FFFFFF",
    strokeWidth: 0
  });
  caps.push({ id: "cap_" + i, y: floorY - 6 });
}

ui.addText({
  id: "title",
  x: 20,
  y: 20,
  text: "AUDIO VISUALIZER",
  fontSize: 16,
  fontColor: "rgb(200,200,220)"
});

ui.addText({
  id: "rms",
  x: 20,
  y: 42,
  text: "L: 0.0%  R: 0.0%",
  fontSize: 12,
  fontColor: "rgb(130,130,150)"
});

var capFall = 4;

ipcRenderer.on("audio-data", function (event, data) {
  if (data.rms) {
    var lRaw = data.rms[0] || 0;
    var rRaw = data.rms[1] || 0;
    ui.setElementProperties("rms", {
      text: "L: " + (lRaw * 100).toFixed(1) + "%  R: " + (rRaw * 100).toFixed(1) + "%"
    });
  }

  if (data.bands) {
    ui.beginUpdate();
    for (var i = 0; i < bandCount; i++) {
      var v = i < data.bands.length ? data.bands[i] : 0;
      var h = Math.max(2, v * maxBarHeight);
      var y = floorY - h;
      ui.setElementProperties(bars[i], { height: h, y: y });

      var cap = caps[i];
      var capY = Math.min(cap.y + capFall, floorY - 6);
      if (capY > y - 6) capY = y - 6;
      cap.y = capY;
      ui.setElementProperties(cap.id, { y: capY });
    }
    ui.endUpdate();
  }
});
