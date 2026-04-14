"use strict";

/**
 * index.js — public entry point
 *
 * const { photoshopHslDelta, hexToHsl, GitHubGistWrapper } = require('photoshop-hsl-delta');
 */

const { hexToHsl }           = require("./src/hexToHsl");
const { photoshopHslDelta }  = require("./src/photoshopHslDelta");
const { GitHubGistWrapper }  = require("./src/GitHubGistWrapper");

module.exports = { hexToHsl, photoshopHslDelta, GitHubGistWrapper };
