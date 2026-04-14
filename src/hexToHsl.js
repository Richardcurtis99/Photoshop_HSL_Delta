"use strict";

/**
 * hexToHsl.js
 * -----------
 * Convert a hex colour string to standard HSL values.
 *
 * @param {string} hexColor - 3- or 6-digit hex, with or without leading #
 * @returns {{ h: number, s: number, l: number }}
 *   h: −180 → +180
 *   s:    0 → 100
 *   l:    0 → 100
 */
function hexToHsl(hexColor) {
  let h = hexColor.replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");

  if (!/^[0-9a-fA-F]{6}$/.test(h)) {
    throw new Error(
      `Invalid hex colour: "${hexColor}". Expected a 3- or 6-digit hex string.`
    );
  }

  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;

  const maxC = Math.max(r, g, b);
  const minC = Math.min(r, g, b);
  const delta = maxC - minC;

  const L = (maxC + minC) / 2;
  const S = delta !== 0 ? delta / (1 - Math.abs(2 * L - 1)) : 0;

  let H = 0;
  if (delta !== 0) {
    if (maxC === r)      H = ((g - b) / delta) % 6;
    else if (maxC === g) H = (b - r) / delta + 2;
    else                 H = (r - g) / delta + 4;
  }
  H *= 60;
  if (H > 180) H -= 360;

  return { h: H, s: S * 100, l: L * 100 };
}

module.exports = { hexToHsl };
