## Context

The project uses emoji/unicode characters for UI affordances (buttons, markers). Obsidian has a built-in Lucide icon system (`setIcon()`) that renders crisp SVG icons. The gantt-ui package is platform-agnostic and cannot call `Obsidian.setIcon()` directly. The `GanttPlatform` abstraction already exists for storage, fetch, connectors, and theme — icons follow the same pattern.

**Current state:**
- 5 action button locations use raw emoji: `✎` (edit), `🗑` (delete, 3×), `✕` (close), `x` (cancel, 2×)
- 6 KeyDate presets use unicode symbols: `✓▲◆◎●▶`
- `KeyDate.icon` is typed as `string` and documented as "1-2 character label"
- `KeyDateMarker` renders the icon as raw text inside a `<span>` with `font-size: 7px`

## Goals / Non-Goals

**Goals:**
- Replace all UI button emojis with crisp Lucide SVG icons via platform abstraction
- Provide a visual icon picker for KeyDate editing instead of a free-text input
- Render KeyDate markers with proper SVG icons instead of tiny unicode text
- Keep the platform abstraction clean — `gantt-ui` never imports from Obsidian

**Non-Goals:**
- Replacing all Lucide icons with a custom icon set
- Changing KeyDate marker shape/size (stays 10×10 diamond)
- Web-app icon migration (no-op stub only)
- Bundling Lucide into gantt-ui (Obsidian provides it at runtime)

## Decisions

### Decision 1: `setIcon` on `GanttPlatform` (not a separate abstraction)

**Choice**: Add `setIcon(el: HTMLElement, name: string): void` directly to `GanttPlatform`.

**Alternatives considered**:
- Separate `IIconRenderer` interface → over-abstracted for a single method
- Import Lucide directly in gantt-ui → violates platform boundary, adds bundle weight
- Pass icon VNodes through platform → mixes rendering concerns with data concerns

**Why**: Single method, same pattern as other platform capabilities. Minimal interface surface.

### Decision 2: `Icon` component via `useRef` + `useEffect`

**Choice**: A Preact component that renders a `<span ref={...}>` and calls `platform.setIcon(ref.current, name)` in `useEffect`.

```
function Icon({ name, size = 16 }: { name: string; size?: number }) {
  // 1. create span ref
  // 2. useEffect → platform.setIcon(el, name)
  //    Obsidian's setIcon replaces innerHTML with SVG
  // 3. render <span class="gantt-icon" style={width: size, height: size} />
}
```

**Why**: Preact has no direct DOM access from JSX. The ref + effect pattern is the standard way to bridge imperative APIs (like `Obsidian.setIcon`) into declarative Preact. Same pattern Preact uses for third-party libraries.

### Decision 3: Icon picker as a grid dropdown

**Choice**: Replace the text `<input>` for KeyDate icon with a button that opens a 4-column grid of clickable Lucide icons.

Curated set (16 icons, covering common milestone meanings):
```
check       triangle       diamond      target
circle      play           star         flag
clock       calendar       alert-triangle  zap
pin         bookmark       heart        thumbs-up
```

**Why**: 
- A grid gives visual affordance — users see the icons, not guess icon names
- 16 icons covers the semantic range of milestone markers without overwhelming
- 4-column grid is compact enough to fit in the detail panel
- The preset buttons already provide the 6 most common choices one-click

**Alternatives considered**:
- Autocomplete text input → requires users to know Lucide names
- Full Lucide browser (>1000 icons) → too heavy for a dropdown
- Keep text input but validate → doesn't solve the "guess the name" problem

### Decision 4: KeyDate preset icon migration

**Choice**: Change preset `icon` values from unicode to Lucide names:

| Preset | Old | New |
|--------|-----|-----|
| 验收时间 | `✓` | `check` |
| 上线时间 | `▲` | `triangle` |
| 提测时间 | `◆` | `diamond` |
| 评审时间 | `◎` | `target` |
| 交付时间 | `●` | `circle` |
| 启动时间 | `▶` | `play` |

**Why**: Lucide icon names are the canonical identifiers. The presets are seed data, not user data, so migration is just a code change.

### Decision 5: KeyDateMarker SVG rendering

**Choice**: In `KeyDateMarker`, replace the `<span>{props.icon}</span>` text node with an `Icon` component call using `platform.setIcon`. The diamond stays at 10×10px; the inner SVG scales to fill.

**Why**: The diamond marker shape is a separate visual concern from the icon. The `setIcon` call renders an SVG that will naturally fit the container. On Obsidian, `setIcon` creates an `svg` element with `width="1em" height="1em"`, so `font-size` on the wrapper controls the size.

### Decision 6: Web-app no-op

**Choice**: `setIcon` in the web platform is `(el, name) => { el.textContent = name; }` — a minimal fallback that shows the icon name as text.

**Why**: Web-app icon migration is deferred. Showing the icon name is better than a blank button or crashing. This is explicitly documented as a stub.

## Risks / Trade-offs

- **Icon name mismatch between environments**: If Lucide version differs between Obsidian and what we expect, some icon names might not resolve → Curated set uses stable, long-standing Lucide names. `setIcon` silently does nothing for unknown names.
- **KeyDate.icon backwards compat**: Existing user data has unicode `icon` values → At render time, if the icon value is a single unicode char (not matching a known Lucide name), render it as text (existing behavior). This provides seamless migration.
- **Preact re-render clobbering SVG**: `setIcon` sets `innerHTML`, which Preact may overwrite on re-render → The `Icon` component's `span` has no children in JSX, so Preact won't diff its content. The ref-based DOM mutation survives re-renders.
