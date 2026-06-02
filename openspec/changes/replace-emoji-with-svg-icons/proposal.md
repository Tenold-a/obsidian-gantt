## Why

The project currently uses raw emoji/unicode characters (✎, 🗑, ✕, ✓, ▲, ◆, etc.) for UI buttons and key date markers. These render inconsistently across platforms and look amateurish compared to Obsidian's native Lucide SVG icons. Obsidian provides a built-in Lucide icon system via `setIcon()`, and the UI should leverage it for a polished, native-feeling experience.

## What Changes

- Add `setIcon(el: HTMLElement, name: string): void` to `GanttPlatform` — **BREAKING** for platform implementors (new required method)
- Create an `Icon` Preact component in gantt-ui that wraps platform `setIcon` via ref + effect
- Replace all UI action button emojis with Lucide icons: ✎→`pencil`, 🗑→`trash-2`, ✕/x→`x`
- Change KeyDate preset `icon` values from unicode characters to Lucide icon names (✓→`check`, ▲→`triangle`, ◆→`diamond`, ◎→`target`, ●→`circle`, ▶→`play`)
- Replace KeyDate icon text input with a visual icon picker (grid dropdown of common Lucide icons)
- Render KeyDate marker icons via `setIcon` as SVG instead of raw unicode text
- Obsidian platform: implement `setIcon` by delegating to `Obsidian.setIcon()`
- Web-app platform: provide a no-op `setIcon` stub (web app icon migration deferred)
- Update `KeyDate.icon` documentation: no longer restricted to "1-2 characters"

## Capabilities

### New Capabilities

- `icon-system`: Platform-abstracted SVG icon rendering — `setIcon` on `GanttPlatform`, `Icon` Preact component consuming it, icon picker UI for selecting from a curated set of Lucide icons, and SVG-based icon rendering inside `KeyDateMarker` diamonds.

### Modified Capabilities

- `platform-abstraction`: `GanttPlatform` interface gains a required `setIcon(el: HTMLElement, name: string): void` method. Obsidian platform delegates to `Obsidian.setIcon()`; web-app platform provides a no-op stub.

## Impact

- **gantt-core**: `GanttPlatform` interface gains `setIcon` method; `KeyDate.icon` semantics widen from "1-2 chars" to "Lucide icon name string"
- **gantt-ui**: New `Icon` component; `GanttChart.tsx` buttons and KeyDate editor replaced; `KeyDateMarker` in `components.tsx` updated to use `setIcon`; new icon picker component
- **obsidian-plugin**: Platform `setIcon` implementation via `Obsidian.setIcon()`
- **web-app**: No-op `setIcon` stub in web platform (icons remain as-is for now)
