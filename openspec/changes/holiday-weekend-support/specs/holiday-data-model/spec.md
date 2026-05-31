## ADDED Requirements

### Requirement: Weekend detection from date strings
The system SHALL classify Saturday and Sunday as weekend days. A utility function `isWeekend(date: string): boolean` SHALL return `true` for dates that fall on Saturday or Sunday, and `false` otherwise. The function SHALL use UTC-based day-of-week calculation to avoid timezone edge cases.

#### Scenario: Saturday is weekend
- **WHEN** the date is "2026-06-06" (a Saturday)
- **THEN** `isWeekend("2026-06-06")` SHALL return `true`

#### Scenario: Monday is not weekend
- **WHEN** the date is "2026-06-08" (a Monday)
- **THEN** `isWeekend("2026-06-08")` SHALL return `false`

#### Scenario: Sunday is weekend
- **WHEN** the date is "2026-06-07" (a Sunday)
- **THEN** `isWeekend("2026-06-07")` SHALL return `true`

### Requirement: Holiday data structure
The system SHALL maintain two sets of dates in `HolidayConfig`: `holidayDates` for non-working holidays (including weekdays off), and `makeupWorkdays` for weekend days designated as working days (班). Both SHALL be arrays of ISO date strings serializable to JSON. Fields missing from loaded configs SHALL default to empty arrays.

#### Scenario: Check if date is a holiday
- **WHEN** `holidayDates` contains "2026-06-15" and holidays are enabled
- **THEN** `isNonWorkingDay("2026-06-15")` SHALL return `true`

#### Scenario: Serialize config to JSON
- **WHEN** the config has `holidayDates: ["2026-01-01"]` and `makeupWorkdays: ["2026-01-04"]`
- **THEN** serialization SHALL include both arrays

#### Scenario: Deserialize old config missing makeupWorkdays
- **WHEN** loading a config without `makeupWorkdays` field
- **THEN** `makeupWorkdays` SHALL default to `[]`

### Requirement: Combined non-working day check with makeup override
The system SHALL provide `isNonWorkingDay(date, config): boolean`. A date is non-working if: (a) holidays are enabled AND the date is in `holidayDates`, OR (b) weekends are enabled AND the date is a weekend AND the date is NOT in `makeupWorkdays`. Makeup workdays SHALL override weekend treatment. When both toggles are disabled, it SHALL always return `false`.

#### Scenario: Weekend overridden by makeup workday
- **WHEN** `weekendsEnabled` is `true`, the date is a Saturday, and the date is in `makeupWorkdays`
- **THEN** `isNonWorkingDay` SHALL return `false`

#### Scenario: Holiday on a weekend still non-working
- **WHEN** `holidaysEnabled` is `true`, the date is a Sunday, and the date is in `holidayDates`
- **THEN** `isNonWorkingDay` SHALL return `true` regardless of weekend status

#### Scenario: Both disabled
- **WHEN** both `weekendsEnabled` and `holidaysEnabled` are `false`
- **THEN** `isNonWorkingDay` SHALL return `false` for any date

### Requirement: Date label type classification
The system SHALL provide `getDateLabelType(date, config): DateLabelType` returning one of `'normal'`, `'weekend'`, `'holiday'`, or `'makeup'`. Holiday dates (休) SHALL take precedence over weekend classification. Makeup workdays (班) SHALL be detected when a weekend date appears in `makeupWorkdays`.

#### Scenario: Weekday holiday
- **WHEN** the date is a Tuesday in `holidayDates` with holidays enabled
- **THEN** `getDateLabelType` SHALL return `'holiday'`

#### Scenario: Weekend makeup workday
- **WHEN** the date is a Saturday in `makeupWorkdays` with holidays enabled
- **THEN** `getDateLabelType` SHALL return `'makeup'`

#### Scenario: Regular weekend
- **WHEN** the date is a Sunday not in `makeupWorkdays`, weekends enabled
- **THEN** `getDateLabelType` SHALL return `'weekend'`

### Requirement: iCalendar (.ics) file parsing with multi-day support
The system SHALL parse iCalendar (RFC 5545) files and extract dates from `VEVENT` components. Both `DTSTART` and `DTEND` SHALL be used to expand multi-day events into individual dates in `[DTSTART, DTEND)`. The `SUMMARY` property SHALL be extracted for classification. Both date-only format (`VALUE=DATE:20260101`) and date-time format SHALL be supported. Non-VEVENT components SHALL be ignored.

#### Scenario: Multi-day event expanded
- **WHEN** a VEVENT has `DTSTART:20260501` and `DTEND:20260506`
- **THEN** the result SHALL include dates "2026-05-01" through "2026-05-05" (5 dates)

#### Scenario: Single-day event (no DTEND)
- **WHEN** a VEVENT has `DTSTART:20260501` and no DTEND
- **THEN** the result SHALL include only "2026-05-01"

#### Scenario: SUMMARY extracted for classification
- **WHEN** a VEVENT has `SUMMARY:春节`
- **THEN** the event SHALL carry `summary: "春节"` for classification

### Requirement: ICS event classification
The system SHALL provide `classifyICSEvents(events)` that separates parsed events into `holidayDates` and `makeupWorkdays`. Events whose SUMMARY matches keywords for makeup workdays (`补班`, `班`, `调休上班`, `makeup`, `workday`) SHALL be classified as makeup workdays. All other events SHALL be classified as holidays.

#### Scenario: Makeup workday detected
- **WHEN** an event has `summary: "劳动节补班"`
- **THEN** it SHALL be classified as a makeup workday

#### Scenario: Regular holiday
- **WHEN** an event has `summary: "清明节"`
- **THEN** it SHALL be classified as a holiday

### Requirement: Holiday configuration persistence
The holiday configuration (`weekendsEnabled`, `holidaysEnabled`, `holidayDates`, `makeupWorkdays`) SHALL be persisted in the view's settings JSON file. The configuration SHALL be loaded when the view is opened and saved when modified. Missing fields from older configs SHALL be backfilled with defaults.

#### Scenario: Load holiday config on view open
- **WHEN** a view is loaded and settings contain holiday config
- **THEN** the store SHALL have all four fields populated with saved or default values

#### Scenario: Default config
- **WHEN** no settings file exists
- **THEN** defaults SHALL be `weekendsEnabled: true`, `holidaysEnabled: true`, `holidayDates: []`, `makeupWorkdays: []`
