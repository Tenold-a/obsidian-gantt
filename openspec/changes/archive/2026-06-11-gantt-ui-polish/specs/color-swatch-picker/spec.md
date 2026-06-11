## ADDED Requirements

### Requirement: Color swatch picker component
The system SHALL provide a `ColorSwatchPicker` component that displays a grid of preset color tiles. Users SHALL be able to select a color by clicking a tile, with the selected tile visually distinguished. The component SHALL support an optional "Custom" option that falls back to the native `<input type="color">` for arbitrary color selection.

#### Scenario: Preset colors displayed as tiles
- **WHEN** the ColorSwatchPicker renders
- **THEN** it SHALL display a grid of color tiles using the PRESET_COLORS palette

#### Scenario: Click to select color
- **WHEN** the user clicks a color tile
- **THEN** that tile SHALL show a selection indicator (border or ring) and the `onChange` callback SHALL be invoked with the selected color value

#### Scenario: Currently selected color indicated
- **WHEN** the ColorSwatchPicker renders with a `value` prop
- **THEN** the tile matching that value SHALL display a selection indicator

#### Scenario: Custom color fallback
- **WHEN** the user clicks the "Custom" option in the swatch picker
- **THEN** a native `<input type="color">` SHALL appear allowing arbitrary color input
