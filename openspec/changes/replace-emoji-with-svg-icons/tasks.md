## 1. Core interface — setIcon on GanttPlatform

- [x] 1.1 Add `setIcon(el: HTMLElement, name: string): void` to `GanttPlatform` interface in `packages/gantt-core/src/index.ts`

## 2. Obsidian platform — setIcon implementation

- [x] 2.1 Implement `setIcon` in `packages/obsidian-plugin/src/platform.ts` by delegating to `Obsidian.setIcon()`
- [x] 2.2 Import `setIcon` from `obsidian` package (already an external dependency)

## 3. Web platform — setIcon no-op stub

- [x] 3.1 Add `setIcon` stub to web platform in `packages/web-app/src/main.tsx` that sets `el.textContent` to the icon name as fallback text

## 4. Icon component

- [x] 4.1 Create `packages/gantt-ui/src/icon.tsx` with module-level `configureIconRenderer(fn)` and `Icon` component using `useRef` + `useEffect` to call the renderer
- [x] 4.2 Call `configureIconRenderer(platform.setIcon.bind(platform))` in `createGanttStore` in `packages/gantt-ui/src/store.ts`

## 5. UI button emoji replacement

- [x] 5.1 Replace ✎ edit button in project detail header with `<Icon name="pencil" size={13} />` (GanttChart.tsx ~line 1173)
- [x] 5.2 Replace 🗑 delete button in project detail header with `<Icon name="trash-2" size={13} />` (GanttChart.tsx ~line 1182)
- [x] 5.3 Replace ✕ close button in project detail header with `<Icon name="x" size={14} />` (GanttChart.tsx ~line 1191)
- [x] 5.4 Replace 🗑 delete button in task detail header with `<Icon name="trash-2" size={14} />` (GanttChart.tsx ~line 1785)
- [x] 5.5 Replace x close button in task detail header with `<Icon name="x" size={16} />` (GanttChart.tsx ~line 1793)
- [x] 5.6 Replace ✎ edit button in tag list with `<Icon name="pencil" size={13} />` (GanttChart.tsx ~line 2269)
- [x] 5.7 Replace x cancel button in tag delete with `<Icon name="x" size={10} />` (GanttChart.tsx ~line 2281)
- [x] 5.8 Replace 🗑 delete button in tag list with `<Icon name="trash-2" size={13} />` (GanttChart.tsx ~line 2288)

## 6. KeyDate preset icon migration

- [x] 6.1 Change `KEY_DATE_PRESETS` icon values from unicode to Lucide names: ✓→`check`, ▲→`triangle`, ◆→`diamond`, ◎→`target`, ●→`circle`, ▶→`play` (GanttChart.tsx ~lines 844-851)

## 7. KeyDate icon picker

- [x] 7.1 Define curated icon list (16 Lucide names) in `packages/gantt-ui/src/icon.tsx`: check, triangle, diamond, target, circle, play, star, flag, clock, calendar, alert-triangle, zap, pin, bookmark, heart, thumbs-up
- [x] 7.2 Replace the KeyDate icon text input in project detail editor with icon picker button + dropdown grid (GanttChart.tsx ~lines 1426-1437)
- [x] 7.3 Render current icon selection in the picker button using `Icon` component, or placeholder text ("Select icon...") if none selected
- [x] 7.4 Add clear button in the picker dropdown to remove icon selection
- [x] 7.5 Render preset buttons using `Icon` component for their icons (GanttChart.tsx ~line 1389/1406)
- [x] 7.6 Render KeyDate list items in detail panel using `Icon` component (GanttChart.tsx ~lines 1505-1508)

## 8. KeyDateMarker SVG rendering

- [x] 8.1 Update `KeyDateMarker` in `packages/gantt-ui/src/components.tsx` to detect Lucide name vs legacy unicode: if icon value is a known Lucide name, use `setIcon`; if unicode char, render as text (fallback); if empty, render nothing
- [x] 8.2 Size the SVG icon to fit within the 10×10px diamond (font-size or explicit size control on the wrapper span)
- [x] 8.3 Ensure icon color is white for visibility against colored diamond background

## 9. Build verification

- [x] 9.1 Run `npm run build` (or equivalent) and verify no type errors across all packages
- [x] 9.2 Verify gantt-core builds independently
- [x] 9.3 Verify gantt-ui builds with new Icon component
- [x] 9.4 Verify obsidian-plugin builds with setIcon implementation
- [x] 9.5 Verify web-app builds with no-op stub
