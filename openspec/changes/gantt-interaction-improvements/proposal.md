## Why

Gantt chart interaction has several friction points: selecting a task/project auto-scrolls the timeline away from the user's view, there's no way to manually locate an entity in the timeline, the selection highlight blends in with related-task highlights, task details are read-only, scroll sync between person/project panes has timing-dependent drift, the position editor popup appears far from its trigger button, and external API connectors can't make HTTP requests due to a missing bind step.

## What Changes

- **Remove auto-scroll on selection** — selecting a task or project no longer jumps the timeline
- **Add locate button** — target icon in task/project detail panels that scrolls both X and Y axes to bring the entity into view
- **Enhanced selection highlighting** — selected task bar renders on top (z-index 1000) with breathing glow animation (orange pulse); selected project row gets orange border/background distinct from generic highlight
- **Task detail editing** — full edit mode with pencil button: start/end date, progress slider, person/project selectors, URL, dependencies add/remove, tags add/remove
- **Fix scroll sync drift** — initial scroll-to-today moved from per-Timeline `requestAnimationFrame` to a single DualPane `useEffect`, eliminating width-dependent computation that caused person/project pane misalignment
- **Fix Y-axis scroll sync** — added `scrollTop` sync effect in Timeline so programmatic vertical scroll (locate button) moves both task list and timeline
- **Fix position editor popup placement** — popup rendered to `document.body` via ref callback portal to escape Obsidian's CSS containment which broke `position: fixed`
- **Fix connector requestUrl** — added `bindObsidianFetch` call in `view.tsx` to inject Obsidian's `requestUrl` into the platform before connector use
- **Test API connector & server** — zero-dependency local HTTP server (`test-server/server.mjs`) with 55 tasks/14 persons/10 projects and a `test-api-connector.js` with full fetch/transform/push support
