"use strict";

/**
 * test/photoshopHslDelta.test.js
 * --------------------------------
 * Basic unit tests (Node.js built-in `assert` — no test runner needed).
 * Run with:  node test/photoshopHslDelta.test.js
 */

const assert = require("assert");
const { hexToHsl, photoshopHslDelta } = require("../index");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓  ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗  ${name}`);
    console.error(`     ${err.message}`);
    failed++;
  }
}

// ── hexToHsl ──────────────────────────────────────────────────────────────────

console.log("\nhexToHsl");

test("black (#000000) → h=0, s=0, l=0", () => {
  const { h, s, l } = hexToHsl("#000000");
  assert.strictEqual(Math.round(h), 0);
  assert.strictEqual(Math.round(s), 0);
  assert.strictEqual(Math.round(l), 0);
});

test("white (#ffffff) → h=0, s=0, l=100", () => {
  const { h, s, l } = hexToHsl("#ffffff");
  assert.strictEqual(Math.round(h), 0);
  assert.strictEqual(Math.round(s), 0);
  assert.strictEqual(Math.round(l), 100);
});

test("pure red (#ff0000) → h=0, s=100, l=50", () => {
  const { h, s, l } = hexToHsl("#ff0000");
  assert.strictEqual(Math.round(h), 0);
  assert.strictEqual(Math.round(s), 100);
  assert.strictEqual(Math.round(l), 50);
});

test("shorthand 3-digit (#fff) is accepted", () => {
  const { l } = hexToHsl("#fff");
  assert.strictEqual(Math.round(l), 100);
});

test("no leading # is accepted", () => {
  const { l } = hexToHsl("000000");
  assert.strictEqual(Math.round(l), 0);
});

test("invalid hex throws", () => {
  assert.throws(() => hexToHsl("#zzzzzz"), /Invalid hex colour/);
});

// ── photoshopHslDelta ─────────────────────────────────────────────────────────

console.log("\nphotoshopHslDelta");

test("same colour → delta is 0, 0, 0", () => {
  const d = photoshopHslDelta("#2d308b", "#2d308b");
  assert.deepStrictEqual(d, { h: 0, s: 0, l: 0 });
});

test("reference #2d308b → target #e1aacb returns integer delta", () => {
  const d = photoshopHslDelta("#2d308b", "#e1aacb");
  assert.strictEqual(typeof d.h, "number");
  assert.strictEqual(typeof d.s, "number");
  assert.strictEqual(typeof d.l, "number");
  // Values must be within Photoshop ranges
  assert.ok(d.h >= -180 && d.h <= 180, `h out of range: ${d.h}`);
  assert.ok(d.s >= -100 && d.s <= 100, `s out of range: ${d.s}`);
  assert.ok(d.l >= -100 && d.l <= 100, `l out of range: ${d.l}`);
});

test("black → white gives maximum lightness delta (+100)", () => {
  const d = photoshopHslDelta("#000000", "#ffffff");
  assert.strictEqual(d.l, 100);
});

test("white → black gives minimum lightness delta (-100)", () => {
  const d = photoshopHslDelta("#ffffff", "#000000");
  assert.strictEqual(d.l, -100);
});

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
