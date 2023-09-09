# Change Log

## [0.0.9] (09.09.2023)

### Added

- Add command that opens the AVA documentation.

## [0.0.8] (16.06.2023)

### Fixed

- Fix: https://github.com/sculpt0r/vsc-ava-test-runner/issues/8: Parsing error with single-line comments.
  - commented code broke code lenses, so they disapper for the entire file

## [0.0.7] (26.01.2023)

### Added

- Run a single test file in DEBUG mode.
- Add option: `--watch` to single test file and single test case run.

## [0.0.6] (19.12.2022)

### Fixed

- Fix: https://github.com/sculpt0r/vsc-ava-test-runner/issues/4: Invalid active file path resolve on windows.

## [0.0.5] (19.08.2022)

### Fixed

- Fix: escape character `\` in test title, makes matching failed.

## [0.0.4] (19.08.2022)

### Added

- Debug test case (as Code Lens `Debug`).

## [0.0.3] (23.07.2022)

### Added

- Properly register plugin option with `package.json`. This allow intellisense for plugin config.
- Add plugin logo.
- Update dependencies.

## [0.0.2] (05.07.2022)

### Added

- Add extension setting: `ava-runner.experimentalEnabled`
- Add experimental feature: run test case via [line number](https://github.com/avajs/ava/blob/main/docs/05-command-line.md#running-tests-at-specific-line-numbers). Use the `ava-runner.experimentalEnabled` config option to enable that feature.

## [0.0.1] (22.06.2022)

Initial release.

### Added

- Run a single test file with the command: `AVA: Run tests in this file`.
- Run a single test case with a code lens.
