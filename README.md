# photoshop-hsl-delta

Calculate the **Photoshop HSL offset** between two hex colours, and optionally store the function as a **GitHub Gist** via the included API wrapper.

Ported from the original Python implementation.

---

## Repository structure

```
photoshop-hsl-delta/
├── src/
│   ├── hexToHsl.js           # Hex → HSL conversion
│   ├── photoshopHslDelta.js  # HSL delta calculation
│   └── GitHubGistWrapper.js  # GitHub Gist API wrapper
├── test/
│   └── photoshopHslDelta.test.js
├── index.js                  # Public entry point
├── package.json
├── .env.example
└── .gitignore
```

---

## Installation

```bash
git clone https://github.com/<your-username>/photoshop-hsl-delta.git
cd photoshop-hsl-delta
```

No external dependencies — uses Node.js built-ins only (requires Node ≥ 18).

---

## Usage

### Local calculation

```js
const { photoshopHslDelta } = require('./index');

const delta = photoshopHslDelta('#2d308b', '#e1aacb');
//  reference ↑ (input)     target ↑ (output)

console.log(delta);
// → { h: 109, s: -42, l: 40 }
```

| Parameter   | Role   | Type   | Example      |
|-------------|--------|--------|--------------|
| `reference` | Input  | string | `"#2d308b"` |
| `target`    | Output | string | `"#e1aacb"` |

**Return value** — `{ h, s, l }` integers in the Photoshop HSL range:

| Key | Range        | Meaning           |
|-----|-------------|-------------------|
| `h` | −180 → +180 | Hue delta         |
| `s` | −100 → +100 | Saturation delta  |
| `l` | −100 → +100 | Lightness delta   |

---

### GitHub Gist API wrapper

The `GitHubGistWrapper` class lets you create, retrieve, update, and delete a Gist containing the function.

**Setup** — create a `.env` file (see `.env.example`) with your [GitHub Personal Access Token](https://github.com/settings/tokens) (needs the `gist` scope):

```
GITHUB_TOKEN=ghp_your_token_here
```

**Example**

```js
const { GitHubGistWrapper } = require('./index');

async function main() {
  const wrapper = new GitHubGistWrapper(process.env.GITHUB_TOKEN);

  // Run locally — no API call
  const delta = wrapper.runDelta('#2d308b', '#e1aacb');
  console.log(`H=${delta.h > 0 ? '+' : ''}${delta.h}  S=${delta.s > 0 ? '+' : ''}${delta.s}  L=${delta.l > 0 ? '+' : ''}${delta.l}`);

  // Create a private gist
  const created = await wrapper.createHslDeltaGist({ isPublic: false });
  console.log('Gist URL:', created.html_url);

  // Retrieve it
  const { functionSource } = await wrapper.getHslDeltaGist(created.id);
  console.log(functionSource);

  // Delete it
  await wrapper.deleteGist(created.id);
}

main().catch(console.error);
```

---

## Tests

```bash
npm test
```

No test runner needed — uses Node.js built-in `assert`.

---

## Licence

MIT
