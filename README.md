<p align="center">
  <img src=".github/obsidian-reveal.png" alt="Reveal .obsidian icon" width="128">
</p>

# Reveal .obsidian

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) [![Release](https://img.shields.io/github/v/release/infinition/obsidian-reveal?style=flat)](https://github.com/infinition/obsidian-reveal/releases) [![Obsidian Plugin](https://img.shields.io/badge/Obsidian-Plugin-7C3AED?style=flat&logo=obsidian&logoColor=white)](https://obsidian.md/plugins?id=reveal) [![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=flat&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/infinition)

Reveals the `.obsidian` config directory inside Obsidian's File Explorer, and lets you open and edit vault configuration files in a dedicated in-app editor with CSS-aware token editing.

Plugin ID: `obsidian-reveal`

Translations: [French](README.fr.md) | [Spanish](README.es.md) | [German](README.de.md) | [Italian](README.it.md) | [Portuguese](README.pt.md)

---

## What it does

Adds a toggle button to the File Explorer header. When toggled on, `.obsidian` appears as a virtual top-level folder.

From there you can:

- Browse all folders and files inside `.obsidian`.
- Open any file in a dedicated config editor view inside Obsidian.
- Copy the absolute path of any file or folder.
- Reveal files in your system file explorer.

---

## Config editor features

The editor detects CSS tokens inline and provides popover controls for editing them without touching the raw text:

- Colors: `#hex`, `rgb()`, `hsl()`, resolved `var(--token)`.
- Gradients: `linear-gradient`, `radial-gradient`, `conic-gradient`.
- Numeric values with units (slider + numeric input).
- CSS enum values for common properties (display, position, alignment, animation, etc.).
- Transform functions (translate, rotate, skew, scale, perspective).
- `box-shadow` and `text-shadow` with add/remove controls.

Especially useful for editing `.obsidian/snippets/*.css` and style-related plugin configs.

---

## Installation

**Via BRAT** (recommended for beta plugins):
1. Install and enable BRAT in Obsidian.
2. Open BRAT settings and add: `infinition/obsidian-reveal`.

**Manual**:
1. Create `<vault>/.obsidian/plugins/obsidian-reveal/`.
2. Copy `manifest.json`, `main.js`, `styles.css` into it.
3. Restart Obsidian and enable the plugin.

**From source**:
```bash
git clone https://github.com/infinition/obsidian-reveal.git
npm install
npm run build
# copy manifest.json, main.js, styles.css to your vault's plugin folder
```

---

## Usage

1. Open the File Explorer.
2. Click the eye icon in the explorer action bar (or run the command from the palette).
3. Browse `.obsidian` at the top of the tree.
4. Click a file to open it in the config editor.
5. Hover a supported token to open the quick-edit popover.
6. Save with the save action in the view header.

---

## Star History

<a href="https://www.star-history.com/?repos=infinition%2Fobsidian-reveal&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=infinition/obsidian-reveal&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=infinition/obsidian-reveal&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=infinition/obsidian-reveal&type=date&legend=top-left" />
 </picture>
</a>

---

## License

MIT. See [LICENSE](LICENSE).
