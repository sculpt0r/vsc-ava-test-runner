# vsc-ava-test-runner README

Visual Studio Code [AVA](https://github.com/avajs/ava) test runner. This extension helps to run a single test file/test case right from the code.

## Features

Run test file via VS Code command or test case via Code Lens

\!\[code lens\]\(images/readme.png\)

## Requirements

---

## Extension Settings

This extension contributes the following settings:

* `ava-runner.experimentalEnabled` [ boolean ]: enable all [experimental features](#experimental-features). Those features might be unstable or could be removed from the extension in the feature.

## Experimental Features

--

## Known Issues
Single tests are run via the [`--match` option](https://github.com/avajs/ava/blob/main/docs/05-command-line.md#running-tests-with-matching-titles). Be aware that some characters in the test case name have a special meaning.

## Release Notes

Users appreciate release notes as you update your extension.

### 0.0.1

Initial release:
- Run a single test file with the command: `AVA: Run tests in this file`
- run a single test case with a code lens


