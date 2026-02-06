# Reveal .obsidian

Reveal `.obsidian` directly inside Obsidian's File Explorer, then open and edit configuration files in a dedicated in-app editor.

## Translations

- French: `README.fr.md`
- Spanish: `README.es.md`
- German: `README.de.md`
- Italian: `README.it.md`
- Portuguese: `README.pt.md`

## What This Plugin Does

`Reveal .obsidian` adds a toggle button to the File Explorer header to show or hide your vault config directory (`.obsidian`) as a virtual top-level folder.

When revealed, you can:
- Browse `.obsidian` folders and files from the Explorer.
- Open config files in a dedicated editor view inside Obsidian.
- Use contextual tools to copy absolute paths or reveal items in your system file explorer.

## Core Features

- Explorer toggle button with active/inactive state.
- Command Palette command to toggle visibility:
  - `Afficher/Masquer le dossier .obsidian` (current command label).
- Virtual `.obsidian` tree injected at the top of the Explorer.
- Lazy loading of subfolders for fast navigation.
- Context menus on files and folders:
  - Open in Obsidian.
  - Reveal in system explorer.
  - Copy absolute path.
- Custom config editor view with:
  - Save action.
  - Undo/redo controls.
  - Optional live save mode.
  - Reload action.
  - Inline token highlighting and popover editors for CSS-like values.

## Interactive Editor Capabilities

The built-in config editor detects and edits common CSS tokens directly from the file content:
- Colors (`#hex`, `rgb[a]()`, `hsl[a]()`, `var(--token)` when resolvable).
- Gradients (`linear-gradient`, `radial-gradient`, `conic-gradient`).
- Numeric values with units (slider + numeric input where relevant).
- Common enum values for many CSS properties (display, position, alignment, text, animation, etc.).
- `transform` values (translate/rotate/skew/scale/perspective controls).
- `box-shadow` and `text-shadow` (multi-shadow editing with add/remove controls).

This is especially useful for:
- `.obsidian/snippets/*.css`
- Theme/style-related plugin configs
- Any text-based vault config files you want to edit in place

## Installation

### Option 1: Install with BRAT (recommended for community plugins not in the official catalog)

1. Install and enable the **BRAT** plugin in Obsidian.
2. Open BRAT settings.
3. Select **Add Beta plugin**.
4. Enter this repository path: `infinition/obsidian-reveal`
5. Install the plugin, then enable **Reveal .obsidian** in Community Plugins.

### Option 2: Manual Installation

1. Create the plugin folder:
   - `<your-vault>/.obsidian/plugins/obsidian-reveal`
2. Place these files in that folder:
   - `manifest.json`
   - `main.js`
   - `styles.css`
3. Restart Obsidian (or reload plugins).
4. Enable **Reveal .obsidian** in:
   - `Settings -> Community plugins`

### Option 3: Manual Installation from Source

1. Clone this repository.
2. Install dependencies:
   - `npm install`
3. Build the plugin:
   - `npm run build`
4. Copy the built files into:
   - `<your-vault>/.obsidian/plugins/obsidian-reveal`
5. Ensure these files exist in that folder:
   - `manifest.json`
   - `main.js`
   - `styles.css`
6. Enable the plugin in `Settings -> Community plugins`.

## Usage

1. Open the File Explorer panel.
2. Click the reveal button (eye icon) in the explorer action bar.
3. Browse the virtual `.obsidian` folder at the top of the tree.
4. Click a file to open it in the plugin's config editor view.
5. Hover supported tokens to open quick-edit popovers.
6. Save changes with the save action in the view header.

Alternative trigger:
- Run the command palette action `Afficher/Masquer le dossier .obsidian`.

## Compatibility Notes

- Designed for Obsidian desktop workflows.
- The "Reveal in system explorer" context action depends on desktop/Electron capabilities.
- No dedicated settings tab is currently exposed.

## Development

### Prerequisites

- Node.js 16+ (recommended)
- npm

### Setup

```bash
npm install
```

### Development Build (watch)

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

Build output files used by Obsidian:
- `main.js`
- `manifest.json`
- `styles.css`

## Troubleshooting

- The reveal button does not appear:
  - Open the File Explorer panel and wait for the workspace to finish loading.
- `.obsidian` is visible but empty:
  - Verify your vault path and that `.obsidian` exists in the vault root.
- "Reveal in system explorer" does nothing:
  - This action is desktop/Electron-dependent and may not work in restricted environments.

## Project Metadata

- Plugin ID: `obsidian-reveal`
- Name: `Reveal .obsidian`
- Author: `Infinition`
- License: MIT
