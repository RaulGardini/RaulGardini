import { Jimp } from "jimp";

const INPUT = process.env.IMG || "foto.jpeg";
const COLS = parseInt(process.env.COLS || "90", 10);
const MAX_ROWS = parseInt(process.env.MAXROWS || "52", 10);
const INVERT = process.env.INVERT === "1";
const GAMMA = parseFloat(process.env.GAMMA || "1.0");
// character cell aspect (width/height) for the SVG monospace font
const CELL_ASPECT = 0.588;
// dark -> light ramp
const RAMP = " .:-=+*#%@";

const img = await Jimp.read(INPUT);
const w = img.bitmap.width;
const h = img.bitmap.height;

let rows = Math.round((COLS * (h / w)) * CELL_ASPECT);
let cols = COLS;
if (rows > MAX_ROWS) {
  const scale = MAX_ROWS / rows;
  rows = MAX_ROWS;
  cols = Math.round(COLS * scale);
}

// grayscale + contrast for readability
img.greyscale().contrast(0.15);

const cellW = w / cols;
const cellH = h / rows;
const lines = [];
for (let ry = 0; ry < rows; ry++) {
  let line = "";
  for (let cx = 0; cx < cols; cx++) {
    // average brightness over the cell
    const sx = Math.floor(cx * cellW);
    const sy = Math.floor(ry * cellH);
    const ex = Math.min(w, Math.floor((cx + 1) * cellW));
    const ey = Math.min(h, Math.floor((ry + 1) * cellH));
    let sum = 0, n = 0;
    const stepX = Math.max(1, Math.floor((ex - sx) / 3));
    const stepY = Math.max(1, Math.floor((ey - sy) / 3));
    for (let y = sy; y < ey; y += stepY) {
      for (let x = sx; x < ex; x += stepX) {
        const idx = (y * w + x) * 4;
        sum += img.bitmap.data[idx];
        n++;
      }
    }
    let b = n ? sum / n / 255 : 0;
    if (INVERT) b = 1 - b;
    b = Math.pow(b, GAMMA);
    const ci = Math.max(0, Math.min(RAMP.length - 1, Math.round(b * (RAMP.length - 1))));
    line += RAMP[ci];
  }
  lines.push(line.replace(/\s+$/, ""));
}

console.log(`cols=${cols} rows=${rows} (img ${w}x${h})`);
import fs from "node:fs";
fs.writeFileSync("portrait.txt", lines.join("\n"), "utf8");
