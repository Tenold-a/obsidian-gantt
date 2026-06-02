## ADDED Requirements

### Requirement: Platform setIcon method
The `GanttPlatform` interface SHALL provide a `setIcon(el: HTMLElement, name: string): void` method. When called, the method SHALL replace the content of `el` with an SVG icon corresponding to `name`. If `name` is not recognized, the method SHALL silently leave the element unchanged.

#### Scenario: Known icon rendered
- **WHEN** `platform.setIcon(someElement, "pencil")` is called in an Obsidian environment
- **THEN** `someElement.innerHTML` SHALL be replaced with a pencil SVG element

#### Scenario: Unknown icon name
- **WHEN** `platform.setIcon(someElement, "nonexistent-icon")` is called
- **THEN** the element SHALL remain unchanged and no error SHALL be thrown

### Requirement: Icon Preact component
The gantt-ui package SHALL provide an `Icon` component with props `name: string` and optional `size?: number` (default 16). The component SHALL render a `<span>` element and use the platform's `setIcon` to populate it with the requested SVG icon.

#### Scenario: Icon renders via platform
- **WHEN** `<Icon name="trash-2" size={14} />` is rendered in an Obsidian environment
- **THEN** a 14×14 pixel trash icon SVG SHALL appear in the DOM

#### Scenario: Icon survives re-render
- **WHEN** the parent component re-renders without changing the `Icon` props
- **THEN** the SVG icon inside the span SHALL NOT be removed or re-created

### Requirement: Icon picker for KeyDate editing
The KeyDate editor SHALL replace the free-text icon input with a visual icon picker. The picker SHALL display a button showing the currently selected icon (or placeholder text if none). When clicked, the button SHALL open a dropdown grid of selectable Lucide icons. Clicking an icon in the grid SHALL select it and close the dropdown. The picker SHALL include a button to clear the icon selection.

#### Scenario: Opening the icon picker
- **WHEN** the user clicks the icon selection button in a KeyDate row
- **THEN** a 4-column grid of clickable Lucide icons SHALL appear below the button

#### Scenario: Selecting an icon
- **WHEN** the user clicks the "check" icon in the picker grid
- **THEN** the picker SHALL close, the button SHALL display the "check" icon, and the KeyDate's `icon` field SHALL be set to `"check"`

#### Scenario: Clearing icon selection
- **WHEN** the user clicks the clear button in the icon picker with an icon currently selected
- **THEN** the KeyDate's `icon` field SHALL be set to `undefined`

#### Scenario: Preset insertion uses Lucide icon names
- **WHEN** the user clicks the "验收时间" preset button
- **THEN** a KeyDate with `icon: "check"` SHALL be appended (not `icon: "✓"`)

### Requirement: KeyDate marker SVG icon rendering
The `KeyDateMarker` component SHALL render the key date's icon using the platform's `setIcon` instead of raw text. When the icon is a recognized Lucide name, it SHALL render as an SVG icon inside the diamond. When the icon contains a unicode character (legacy data) or is unrecognized, it SHALL render as plain text at the current 7px size.

#### Scenario: Lucide icon in diamond
- **WHEN** a key date has `icon: "check"` and is rendered in Obsidian
- **THEN** the diamond marker SHALL contain a check SVG icon in white color

#### Scenario: Legacy unicode icon fallback
- **WHEN** a key date has `icon: "✓"` (legacy unicode)
- **THEN** the diamond marker SHALL render it as white text at 7px font size

#### Scenario: No icon
- **WHEN** a key date has no `icon` field
- **THEN** the diamond marker SHALL render without any inner icon

### Requirement: UI action buttons use Lucide icons
All UI action buttons in gantt-ui SHALL use the `Icon` component with Lucide icon names instead of raw emoji/unicode characters.

#### Scenario: Edit button uses pencil icon
- **WHEN** a project detail panel or tag list item is displayed
- **THEN** the edit button SHALL show a `pencil` SVG icon instead of `✎`

#### Scenario: Delete button uses trash-2 icon
- **WHEN** a detail panel, task header, or tag list item is displayed
- **THEN** the delete button SHALL show a `trash-2` SVG icon instead of `🗑`

#### Scenario: Close button uses x icon
- **WHEN** a detail panel is open
- **THEN** the close button SHALL show an `x` SVG icon instead of `✕` or `x`
