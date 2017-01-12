# Changelog

This component follows *Semantic Versioning* (aka SemVer), visit (http://semver.org/) to learn more about it.

## Release 2.2.0 (2017-01-12)

### New Features
- Added new option `name` for integrating the autocomplete with an `iron-form`.

## Release 2.1.5 (2016-12-14)

### Bug Fixes
- Fixed option disableShowClear, option was not being behaving as documented, added tests for same. Thanks to @vidhill.

## Release 2.1.4 (2016-12-08)

### Bug Fixes
- Fixed when user pressed UP or DOWN with no results, a JavaScript error was thrown.

## Release 2.1.3 (2016-12-08)

### Bug Fixes
- Preventing the focus to switch from input field when autocomplete-suggestions is a child of an element with tabindex
and user clicks in the scrollbar to scroll over results.

## Release 2.1.2 (2016-12-07)

### Bug Fixes
- `text` and `value` were not set when a selection was made. This is now fixed. 

## Release 2.1.1 (2016-11-29)

### Bug Fixes
- Bumping version to avoid a possible version conflict with Beta and RC versions.

## Release 2.1.0 (2016-11-29)

### New Features
- `paper-autocomplete` has been split in two components: `paper-autocomplete` and `paper-autocomplete-suggestions`.
The second one is a new component containing all the logic related to the popup with suggestions: search, selection,
etc. This allows using the autocomplete functionality with any input field.
- Selection with the keyboard has been changed: now you can go from the first/last to the last/first pressing up/down keys.
- Added test to the component (at this moment, two A11Y tests are failing when the component is test with ShadowDom,
this issue is being investigated).

### Bug Fixes
- When user pressed `left` or `right` key when a component was highlighted, the state was reset. Now the popup is 
 ignoring those key events.

## Release 2.0.0 (2016-11-21)

### New Features
- It is now possible to specify custom templates for suggestions.
- You can now specify your own `queryFn` to filter suggestions according to your needs.
- Added `CHANGELOG.md`

### Breaking Change
- Property `useShadowDom` has been removed because now the component works in both modes without it. You can just remove
  it from your apps. However, if you have it, nothing will break, it will just be ignored.
  
### Bug Fixes
- `setOption()` method was not taking into account `textProperty` and `valueProperty` options.
