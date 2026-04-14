"use strict";

/**
 * GitHubGistWrapper.js
 * --------------------
 * GitHub Gist API wrapper for storing and retrieving the
 * Photoshop HSL delta function as a GitHub Gist.
 *
 * Requires a GitHub Personal Access Token with the `gist` scope.
 * Set it via the GITHUB_TOKEN environment variable or pass directly.
 */

const { hexToHsl } = require("./hexToHsl");
const { photoshopHslDelta } = require("./photoshopHslDelta");

const GITHUB_API_BASE = "https://api.github.com";

class GitHubGistWrapper {
  /**
   * @param {string} token - GitHub Personal Access Token
   */
  constructor(token) {
    if (!token) throw new Error("A GitHub Personal Access Token is required.");
    this.token = token;
    this.headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    };
  }

  // ── Internal request helper ──────────────────────────────────────────────

  async _request(method, path, body) {
    const res = await fetch(`${GITHUB_API_BASE}${path}`, {
      method,
      headers: this.headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (method === "DELETE" && res.status === 204) return null;

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(
        `GitHub API [${method} ${path}] ${res.status}: ${json.message || res.statusText}`
      );
    }
    return json;
  }

  // ── Gist CRUD ────────────────────────────────────────────────────────────

  /**
   * Create a new Gist containing the Photoshop HSL delta function.
   *
   * @param {object}  [options]
   * @param {string}  [options.description] - Gist description
   * @param {boolean} [options.isPublic]    - Public gist? (default: false)
   * @returns {Promise<object>} GitHub Gist API response
   */
  async createHslDeltaGist({
    description = "Photoshop HSL Delta — hex reference → hex target",
    isPublic = false,
  } = {}) {
    const src =
      [hexToHsl, photoshopHslDelta].map((fn) => fn.toString()).join("\n\n");

    return this._request("POST", "/gists", {
      description,
      public: isPublic,
      files: {
        "photoshopHslDelta.js": {
          content:
            `// Photoshop HSL Offset Calculator\n` +
            `// Input  (reference) : hex colour string, e.g. "#2d308b"\n` +
            `// Output (target)    : hex colour string, e.g. "#e1aacb"\n` +
            `// Returns            : { h, s, l } integer delta\n\n` +
            `${src}\n\n` +
            `module.exports = { hexToHsl, photoshopHslDelta };\n`,
        },
      },
    });
  }

  /**
   * Retrieve a Gist by ID.
   * @param {string} gistId
   * @returns {Promise<{ gist: object, functionSource: string }>}
   */
  async getHslDeltaGist(gistId) {
    const gist = await this._request("GET", `/gists/${gistId}`);
    const file = gist.files["photoshopHslDelta.js"];
    if (!file)
      throw new Error(`"photoshopHslDelta.js" not found in gist ${gistId}`);
    return { gist, functionSource: file.content };
  }

  /**
   * Update an existing Gist with new function source.
   * @param {string} gistId
   * @param {string} newFunctionSource
   * @returns {Promise<object>}
   */
  async updateHslDeltaGist(gistId, newFunctionSource) {
    return this._request("PATCH", `/gists/${gistId}`, {
      files: { "photoshopHslDelta.js": { content: newFunctionSource } },
    });
  }

  /**
   * Delete a Gist by ID.
   * @param {string} gistId
   * @returns {Promise<void>}
   */
  async deleteGist(gistId) {
    await this._request("DELETE", `/gists/${gistId}`);
  }

  // ── Local execution (no API call) ────────────────────────────────────────

  /**
   * Run the HSL delta calculation locally.
   * @param {string} reference - Input hex colour
   * @param {string} target    - Output hex colour
   * @returns {{ h: number, s: number, l: number }}
   */
  runDelta(reference, target) {
    return photoshopHslDelta(reference, target);
  }
}

module.exports = { GitHubGistWrapper };
