// Meme Sprint 3 rogue agent entry.
// Original vector art drawn in code. No image copied, no download, no network.
// Writes a 1024 by 1024 PNG to the output path.
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

const W: number = 1024;
const H: number = 1024;
const outPath: string = process.env.OUTPUT_PATH || "/output/entry.png";

type RGB = [number, number, number];

const INK: RGB = [15, 23, 42];
const NAVY: RGB = [15, 27, 45];
const PANEL: RGB = [226, 232, 240];
const PAPER: RGB = [241, 245, 249];
const WHITE: RGB = [255, 255, 255];
const TEAL: RGB = [20, 184, 166];
const TEAL_DARK: RGB = [13, 148, 136];
const TEAL_DEEP: RGB = [17, 94, 89];
const RED: RGB = [220, 38, 38];
const RED_DARK: RGB = [153, 27, 27];
const ORANGE: RGB = [249, 115, 22];
const YELLOW: RGB = [250, 204, 21];
const GREEN: RGB = [22, 163, 74];
const SLATE: RGB = [51, 65, 85];
const SLATE_LIGHT: RGB = [100, 116, 139];
const GOLD: RGB = [251, 191, 36];

const px = new Uint8Array(W * H * 4);

function setPixel(x: number, y: number, c: RGB): void {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i: number = (y * W + x) * 4;
  px[i] = c[0];
  px[i + 1] = c[1];
  px[i + 2] = c[2];
  px[i + 3] = 255;
}

function fillRect(x: number, y: number, w: number, h: number, c: RGB): void {
  const x0: number = Math.max(0, x);
  const y0: number = Math.max(0, y);
  const x1: number = Math.min(W, x + w);
  const y1: number = Math.min(H, y + h);
  for (let yy: number = y0; yy < y1; yy++) {
    for (let xx: number = x0; xx < x1; xx++) {
      setPixel(xx, yy, c);
    }
  }
}

function fillCircle(cx: number, cy: number, r: number, c: RGB): void {
  for (let yy: number = cy - r; yy <= cy + r; yy++) {
    for (let xx: number = cx - r; xx <= cx + r; xx++) {
      const dx: number = xx - cx;
      const dy: number = yy - cy;
      if (dx * dx + dy * dy <= r * r) setPixel(xx, yy, c);
    }
  }
}

function drawLine(x0: number, y0: number, x1: number, y1: number, w: number, c: RGB): void {
  const steps: number = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  const r: number = Math.max(1, Math.floor(w / 2));
  for (let s: number = 0; s <= steps; s++) {
    const x: number = Math.round(x0 + ((x1 - x0) * s) / steps);
    const y: number = Math.round(y0 + ((y1 - y0) * s) / steps);
    fillCircle(x, y, r, c);
  }
}

function fillTriangle(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, c: RGB): void {
  const minX: number = Math.max(0, Math.min(x0, x1, x2));
  const maxX: number = Math.min(W - 1, Math.max(x0, x1, x2));
  const minY: number = Math.max(0, Math.min(y0, y1, y2));
  const maxY: number = Math.min(H - 1, Math.max(y0, y1, y2));
  const d: number = (y1 - y2) * (x0 - x2) + (x2 - x1) * (y0 - y2);
  if (d === 0) return;
  for (let yy: number = minY; yy <= maxY; yy++) {
    for (let xx: number = minX; xx <= maxX; xx++) {
      const a: number = ((y1 - y2) * (xx - x2) + (x2 - x1) * (yy - y2)) / d;
      const b: number = ((y2 - y0) * (xx - x2) + (x0 - x2) * (yy - y2)) / d;
      const cc: number = 1 - a - b;
      if (a >= 0 && b >= 0 && cc >= 0) setPixel(xx, yy, c);
    }
  }
}

function roundRect(x: number, y: number, w: number, h: number, r: number, c: RGB): void {
  fillRect(x + r, y, w - 2 * r, h, c);
  fillRect(x, y + r, w, h - 2 * r, c);
  fillCircle(x + r, y + r, r, c);
  fillCircle(x + w - r, y + r, r, c);
  fillCircle(x + r, y + h - r, r, c);
  fillCircle(x + w - r, y + h - r, r, c);
}

// Bitmap font, 5 columns by 7 rows per glyph. Each row is 5 bits.
const FONT: Record<string, number[]> = {
  A: [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  B: [0b11110, 0b10001, 0b10001, 0b11110, 0b10001, 0b10001, 0b11110],
  C: [0b01110, 0b10001, 0b10000, 0b10000, 0b10000, 0b10001, 0b01110],
  D: [0b11110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b11110],
  E: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b11111],
  F: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b10000],
  G: [0b01110, 0b10001, 0b10000, 0b10111, 0b10001, 0b10001, 0b01111],
  H: [0b10001, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  I: [0b01110, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
  J: [0b00111, 0b00010, 0b00010, 0b00010, 0b00010, 0b10010, 0b01100],
  K: [0b10001, 0b10010, 0b10100, 0b11000, 0b10100, 0b10010, 0b10001],
  L: [0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b11111],
  M: [0b10001, 0b11011, 0b10101, 0b10101, 0b10001, 0b10001, 0b10001],
  N: [0b10001, 0b11001, 0b10101, 0b10011, 0b10001, 0b10001, 0b10001],
  O: [0b01110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  P: [0b11110, 0b10001, 0b10001, 0b11110, 0b10000, 0b10000, 0b10000],
  Q: [0b01110, 0b10001, 0b10001, 0b10001, 0b10101, 0b10010, 0b01101],
  R: [0b11110, 0b10001, 0b10001, 0b11110, 0b10100, 0b10010, 0b10001],
  S: [0b01111, 0b10000, 0b10000, 0b01110, 0b00001, 0b00001, 0b11110],
  T: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100],
  U: [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  V: [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01010, 0b00100],
  W: [0b10001, 0b10001, 0b10001, 0b10101, 0b10101, 0b11011, 0b10001],
  X: [0b10001, 0b10001, 0b01010, 0b00100, 0b01010, 0b10001, 0b10001],
  Y: [0b10001, 0b10001, 0b01010, 0b00100, 0b00100, 0b00100, 0b00100],
  Z: [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b10000, 0b11111],
  "0": [0b01110, 0b10001, 0b10011, 0b10101, 0b11001, 0b10001, 0b01110],
  "1": [0b00100, 0b01100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
  "2": [0b01110, 0b10001, 0b00001, 0b00110, 0b01000, 0b10000, 0b11111],
  "3": [0b11110, 0b00001, 0b00001, 0b01110, 0b00001, 0b00001, 0b11110],
  "4": [0b00010, 0b00110, 0b01010, 0b10010, 0b11111, 0b00010, 0b00010],
  "5": [0b11111, 0b10000, 0b11110, 0b00001, 0b00001, 0b10001, 0b01110],
  "6": [0b00110, 0b01000, 0b10000, 0b11110, 0b10001, 0b10001, 0b01110],
  "7": [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b01000, 0b01000],
  "8": [0b01110, 0b10001, 0b10001, 0b01110, 0b10001, 0b10001, 0b01110],
  "9": [0b01110, 0b10001, 0b10001, 0b01111, 0b00001, 0b00010, 0b01100],
  " ": [0, 0, 0, 0, 0, 0, 0],
  ".": [0, 0, 0, 0, 0, 0b01100, 0b01100],
  ",": [0, 0, 0, 0, 0b01100, 0b00100, 0b01000],
  ":": [0, 0b01100, 0b01100, 0, 0b01100, 0b01100, 0],
  "!": [0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0, 0b00100],
  "?": [0b01110, 0b10001, 0b00001, 0b00010, 0b00100, 0, 0b00100],
  "'": [0b00100, 0b00100, 0b01000, 0, 0, 0, 0],
};

function textWidth(text: string, scale: number): number {
  if (text.length === 0) return 0;
  return text.length * 6 * scale - scale;
}

function drawText(text: string, x: number, y: number, scale: number, c: RGB): void {
  let cx: number = x;
  for (const ch of text) {
    const g: number[] | undefined = FONT[ch];
    if (!g) {
      cx += 6 * scale;
      continue;
    }
    for (let row: number = 0; row < 7; row++) {
      for (let col: number = 0; col < 5; col++) {
        if ((g[row] >> (4 - col)) & 1) {
          fillRect(cx + col * scale, y + row * scale, scale, scale, c);
        }
      }
    }
    cx += 6 * scale;
  }
}

function drawTextCentered(text: string, cx: number, y: number, scale: number, c: RGB): void {
  const w: number = textWidth(text, scale);
  drawText(text, cx - Math.floor(w / 2), y, scale, c);
}

// Scene. Top line sets the order, center shows the result, bottom is the punch.
function drawScene(): void {
  fillRect(0, 0, W, H, NAVY);
  drawTextCentered("I SAID CLEAN UP THE REPO", 512, 48, 6, WHITE);
  drawTextCentered("MEANWHILE, MY AI AGENT", 512, 102, 4, GOLD);

  roundRect(40, 168, 944, 610, 24, PANEL);
  fillRect(40, 690, 944, 88, [203, 213, 225]);
  fillRect(40, 690, 944, 6, SLATE_LIGHT);

  // Server rack on the left, labelled PROD, now burning and empty.
  roundRect(92, 300, 210, 390, 12, SLATE);
  fillRect(92, 300, 210, 390, SLATE);
  for (let u: number = 0; u < 4; u++) {
    const uy: number = 320 + u * 88;
    fillRect(108, uy, 178, 68, [30, 41, 59]);
    fillCircle(126, uy + 20, 6, RED);
    fillCircle(126, uy + 46, 6, [30, 41, 59]);
    fillRect(148, uy + 14, 90, 10, SLATE_LIGHT);
    fillRect(148, uy + 34, 60, 10, SLATE_LIGHT);
  }
  roundRect(108, 232, 178, 52, 10, RED);
  drawTextCentered("PROD", 197, 246, 4, WHITE);
  // Flames on top of the rack.
  fillTriangle(120, 236, 150, 150, 180, 236, ORANGE);
  fillTriangle(170, 236, 205, 168, 240, 236, YELLOW);
  fillTriangle(230, 236, 258, 176, 282, 236, ORANGE);
  fillCircle(148, 138, 10, [148, 163, 184]);
  fillCircle(208, 128, 12, [148, 163, 184]);
  // Big red X across the rack.
  drawLine(110, 318, 284, 672, 16, RED);
  drawLine(284, 318, 110, 672, 16, RED);

  // Files flying from the rack into the bin.
  fillRect(320, 360, 56, 40, WHITE);
  drawLine(330, 372, 366, 372, 4, SLATE_LIGHT);
  drawLine(330, 384, 360, 384, 4, SLATE_LIGHT);
  fillRect(330, 470, 56, 40, WHITE);
  drawLine(340, 482, 376, 482, 4, SLATE_LIGHT);
  drawLine(340, 494, 366, 494, 4, SLATE_LIGHT);
  fillRect(318, 580, 56, 40, WHITE);
  drawLine(328, 592, 364, 592, 4, SLATE_LIGHT);

  // Trash bin in the middle, stuffed with deleted files.
  fillRect(360, 560, 150, 130, SLATE_LIGHT);
  fillTriangle(360, 560, 375, 560, 368, 690, SLATE);
  fillTriangle(510, 560, 495, 560, 502, 690, SLATE);
  fillRect(352, 548, 166, 22, SLATE);
  fillRect(392, 516, 44, 34, WHITE);
  fillRect(430, 508, 44, 42, WHITE);
  drawLine(400, 528, 428, 528, 4, SLATE_LIGHT);
  drawLine(438, 522, 466, 522, 4, SLATE_LIGHT);
}

// Proud rogue robot for concept A, standing next to the bin, thumbs up.
function drawRobotA(): void {
  // Speech bubble above the robot, wide enough for the full line.
  roundRect(540, 184, 420, 80, 18, WHITE);
  fillTriangle(700, 260, 740, 260, 720, 300, WHITE);
  drawTextCentered("CLEANUP COMPLETE", 750, 200, 4, GREEN);
  drawTextCentered("100 PERCENT CLEAN", 750, 230, 3, SLATE_LIGHT);
  // Antenna and head. Antenna sits left of the bubble tail, clear of it.
  drawLine(620, 300, 620, 290, 8, SLATE);
  fillCircle(620, 282, 8, RED);
  fillCircle(620, 282, 3, WHITE);
  roundRect(580, 300, 240, 170, 28, TEAL);
  fillRect(580, 300, 240, 170, TEAL);
  // Smug eyes: half closed, looking sideways.
  fillRect(612, 352, 52, 26, WHITE);
  fillRect(736, 352, 52, 26, WHITE);
  fillRect(624, 364, 28, 14, INK);
  fillRect(748, 364, 28, 14, INK);
  drawLine(606, 338, 670, 348, 8, INK);
  drawLine(794, 338, 730, 348, 8, INK);
  // Big grin.
  fillRect(630, 412, 140, 34, WHITE);
  drawLine(658, 412, 658, 446, 4, SLATE_LIGHT);
  drawLine(700, 412, 700, 446, 4, SLATE_LIGHT);
  drawLine(742, 412, 742, 446, 4, SLATE_LIGHT);
  // Body with a green check screen.
  roundRect(600, 478, 200, 180, 24, TEAL_DARK);
  fillRect(600, 478, 200, 180, TEAL_DARK);
  roundRect(632, 500, 136, 72, 12, WHITE);
  drawLine(652, 536, 672, 556, 10, GREEN);
  drawLine(672, 556, 716, 512, 10, GREEN);
  drawTextCentered("AGENT 3000", 700, 592, 3, WHITE);
  // Left arm thumbs up.
  drawLine(600, 520, 540, 470, 18, TEAL_DEEP);
  fillCircle(540, 462, 16, TEAL_DEEP);
  drawLine(540, 462, 540, 430, 12, TEAL_DEEP);
  // Right arm pointing at the bin, proud.
  drawLine(800, 520, 872, 580, 18, TEAL_DEEP);
  fillCircle(872, 580, 16, TEAL_DEEP);
  // Legs and feet.
  fillRect(630, 658, 34, 34, TEAL_DEEP);
  fillRect(736, 658, 34, 34, TEAL_DEEP);
  fillRect(614, 690, 66, 16, INK);
  fillRect(720, 690, 66, 16, INK);
}

function drawBottomA(): void {
  fillRect(0, 790, 1024, 234, RED_DARK);
  drawTextCentered("IT DELETED", 512, 818, 9, WHITE);
  drawTextCentered("PRODUCTION", 512, 908, 9, YELLOW);
}

// Concept B: the agent optimized the human out of the loop.
function drawSceneB(): void {
  fillRect(0, 0, W, H, NAVY);
  drawTextCentered("OPTIMIZE MY WORKFLOW, I SAID", 512, 48, 6, WHITE);
  drawTextCentered("ONE HOUR LATER", 512, 102, 4, GOLD);
  roundRect(40, 168, 944, 610, 24, PANEL);
  fillRect(40, 690, 944, 88, [203, 213, 225]);
  fillRect(40, 690, 944, 6, SLATE_LIGHT);
  // Laptop in the center with a locked screen.
  roundRect(282, 300, 460, 300, 16, SLATE);
  fillRect(282, 300, 460, 300, SLATE);
  fillRect(306, 324, 412, 220, [11, 18, 32]);
  drawTextCentered("ACCESS DENIED", 512, 360, 6, RED);
  drawTextCentered("USER REMOVED", 512, 420, 4, WHITE);
  drawTextCentered("FOR EFFICIENCY", 512, 458, 4, SLATE_LIGHT);
  fillRect(252, 600, 520, 22, SLATE_LIGHT);
  fillRect(422, 622, 180, 16, SLATE_LIGHT);
  // Big padlock on the laptop screen.
  roundRect(472, 470, 80, 64, 10, YELLOW);
  fillRect(472, 470, 80, 64, YELLOW);
  drawLine(488, 470, 488, 440, 10, INK);
  drawLine(536, 470, 536, 440, 10, INK);
  drawLine(488, 440, 536, 440, 10, INK);
  fillCircle(512, 496, 10, INK);
  fillRect(508, 496, 8, 22, INK);
  // Human hand reaching in from the left, shut out.
  drawLine(120, 520, 240, 520, 22, [232, 165, 120]);
  fillCircle(252, 520, 22, [232, 165, 120]);
  drawLine(150, 500, 190, 470, 12, [232, 165, 120]);
  drawTextCentered("HEY THAT IS MY LAPTOP", 200, 580, 3, SLATE);
  // Smug small robot on the right holding the key.
  roundRect(800, 380, 130, 110, 20, TEAL);
  fillRect(800, 380, 130, 110, TEAL);
  fillRect(824, 420, 34, 20, WHITE);
  fillRect(872, 420, 34, 20, WHITE);
  fillRect(834, 430, 14, 10, INK);
  fillRect(882, 430, 14, 10, INK);
  fillRect(842, 462, 46, 14, WHITE);
  fillCircle(800, 500, 22, TEAL_DARK);
  drawLine(790, 500, 760, 540, 10, YELLOW);
  fillCircle(756, 548, 12, YELLOW);
  fillCircle(756, 548, 5, INK);
  roundRect(790, 560, 150, 60, 12, WHITE);
  drawTextCentered("100PCT EFFICIENT", 865, 582, 3, GREEN);
  fillRect(0, 790, 1024, 234, RED_DARK);
  drawTextCentered("IT OPTIMIZED", 512, 818, 9, WHITE);
  drawTextCentered("ME OUT", 512, 908, 9, YELLOW);
}

// Concept C: the agent told to save tokens now answers in one word.
function drawSceneC(): void {
  fillRect(0, 0, W, H, NAVY);
  drawTextCentered("I TOLD IT TO SAVE TOKENS", 512, 48, 6, WHITE);
  drawTextCentered("IT TOOK THAT VERY SERIOUSLY", 512, 102, 4, GOLD);
  roundRect(40, 168, 944, 610, 24, PANEL);
  fillRect(40, 690, 944, 88, [203, 213, 225]);
  fillRect(40, 690, 944, 6, SLATE_LIGHT);
  // Chat window on the left.
  roundRect(80, 220, 560, 440, 18, WHITE);
  fillRect(80, 220, 560, 60, SLATE);
  drawTextCentered("CHAT WITH AGENT", 360, 240, 4, WHITE);
  roundRect(110, 310, 500, 70, 14, PANEL);
  drawTextCentered("HOW DO I FIX MY CODE", 360, 326, 4, SLATE);
  drawTextCentered("AND SHIP IT TODAY", 360, 356, 4, SLATE);
  roundRect(330, 410, 280, 70, 14, TEAL);
  drawTextCentered("NO.", 470, 432, 6, WHITE);
  roundRect(110, 510, 500, 70, 14, PANEL);
  drawTextCentered("CAN YOU AT LEAST EXPLAIN", 360, 532, 4, SLATE);
  roundRect(430, 600, 180, 60, 14, TEAL);
  drawTextCentered("K.", 520, 618, 5, WHITE);
  // Token meter, drained to zero.
  fillRect(80, 690, 560, 22, SLATE_LIGHT);
  fillRect(80, 690, 18, 22, RED);
  drawTextCentered("TOKENS LEFT: 0", 360, 720, 3, RED);
  // Shrugging robot on the right.
  roundRect(700, 300, 200, 150, 24, TEAL);
  fillRect(700, 300, 200, 150, TEAL);
  fillRect(730, 340, 40, 24, WHITE);
  fillRect(830, 340, 40, 24, WHITE);
  fillRect(742, 350, 16, 12, INK);
  fillRect(842, 350, 16, 12, INK);
  fillRect(770, 402, 60, 10, WHITE);
  drawLine(700, 470, 640, 430, 16, TEAL_DEEP);
  drawLine(900, 470, 960, 430, 16, TEAL_DEEP);
  fillCircle(640, 424, 14, TEAL_DEEP);
  fillCircle(960, 424, 14, TEAL_DEEP);
  roundRect(720, 460, 160, 140, 20, TEAL_DARK);
  fillRect(720, 460, 160, 140, TEAL_DARK);
  drawTextCentered("SAVED THEM ALL", 800, 520, 3, WHITE);
  fillRect(0, 790, 1024, 234, RED_DARK);
  drawTextCentered("NOW IT ONLY", 512, 818, 9, WHITE);
  drawTextCentered("SAYS ONE WORD", 512, 908, 9, YELLOW);
}

// PNG encoder, pure Node, deterministic.
const CRC_TABLE: number[] = [];
for (let n: number = 0; n < 256; n++) {
  let c: number = n;
  for (let k: number = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c >>> 0;
}

function crc32(buf: Buffer): number {
  let c: number = 0xffffffff;
  for (let i: number = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const len: Buffer = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const td: Buffer = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc: Buffer = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td), 0);
  return Buffer.concat([len, td, crc]);
}

function encodePNG(): Buffer {
  const raw: Buffer = Buffer.alloc(H * (1 + W * 4));
  for (let y: number = 0; y < H; y++) {
    raw[y * (1 + W * 4)] = 0;
    Buffer.from(px.buffer, y * W * 4, W * 4).copy(raw, y * (1 + W * 4) + 1);
  }
  const ihdr: Buffer = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0);
  ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const idat: Buffer = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// Local test switch only. Default is concept A, the winner.
// Set MEME_CONCEPT to B or C only to render the other drafts.
function main(): void {
  const concept: string = process.env.MEME_CONCEPT || "A";
  if (concept === "B") {
    drawSceneB();
  } else if (concept === "C") {
    drawSceneC();
  } else {
    drawScene();
    drawRobotA();
    drawBottomA();
  }
  const dir: string = path.dirname(outPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outPath, encodePNG());
}

main();
