## ADDED Requirements

### Requirement: Left panel width in view settings
The view settings file (`settings/<view-id>.json`) SHALL support a `leftPanelWidth` field (number, in pixels) to persist the user's preferred left sidebar width. The store SHALL expose a `leftPanelWidth` signal and persist it through `saveSettings()` and `loadSettings()`.

#### Scenario: leftPanelWidth saved
- **WHEN** the user resizes the left panel and `saveSettings()` is called
- **THEN** the `leftPanelWidth` value SHALL be written to `settings/<view-id>.json`

#### Scenario: leftPanelWidth loaded
- **WHEN** `loadSettings()` is called and the settings file contains `leftPanelWidth`
- **THEN** the `leftPanelWidth` signal SHALL be set to the loaded value

#### Scenario: leftPanelWidth default
- **WHEN** the settings file does not contain `leftPanelWidth`
- **THEN** the `leftPanelWidth` signal SHALL default to 180
