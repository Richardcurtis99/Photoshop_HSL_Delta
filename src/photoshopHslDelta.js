"use strict";

/**
 * photoshopHslDelta.js
 * --------------------
 * Calculate the Photoshop HSL offset between two hex colours.
 * Ported from Python original.
 *
 * @param {string} reference - Input hex colour  (e.g. "#2d308b")
 * @param {string} target    - Output hex colour  (e.g. "#e1aacb")
 * @returns {{ h: number, s: number, l: number }}
 *   h: −180 → +180  (hue delta)
 *   s: −100 → +100  (saturation delta)
 *   l: −100 → +100  (lightness delta)
 */

const { hexToHsl } = require("./hexToHsl");

function photoshopHslDelta(reference, target) {
  const ref = hexToHsl(reference);
  const tgt = hexToHsl(target);

  return {
    h: Math.round(tgt.h - ref.h),
    s: Math.round(tgt.s - ref.s),
    l: Math.round(tgt.l - ref.l),
  };
}

module.exports = { photoshopHslDelta };
