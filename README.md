[![Build Status](https://travis-ci.com/jehy/jest-runner-mocha.svg?branch=master)](https://travis-ci.org/jehy/jest-runner-mocha) [![npm version](https://badge.fury.io/js/%40kernel-panic%2Fjest-runner-mocha.svg)](https://badge.fury.io/js/%40kernel-panic%2Fjest-runner-mocha)
[![dependencies Status](https://david-dm.org/jehy/jest-runner-mocha/status.svg)](https://david-dm.org/jehy/jest-runner-mocha)
[![devDependencies Status](https://david-dm.org/jehy/jest-runner-mocha/dev-status.svg)](https://david-dm.org/jehy/jest-runner-mocha?type=dev)
[![Known Vulnerabilities](https://snyk.io/test/github/jehy/jest-runner-mocha/badge.svg)](https://snyk.io/test/github/jehy/jest-runner-mocha)

# It's a fork!

It is an experimental  fork of https://github.com/rogeliog/jest-runner-mocha with some experimental
features:

* Support for mocha custom version
* Support for `setupFilesAfterEnv`
* Support for custom `clearMocks` implementation (ex. for sinon)
* See more in changelog!

## Usage

### Install

Install `jest`_(it needs Jest 21+)_ and `@kernel-panic/jest-runner-mocha`

```bash

npm install --save-dev jest @kernel-panic/jest-runner-mocha

```

### Add it to your Jest config

In your `package.json`
```json
{
  "jest": {
    "runner": "@kernel-panic/jest-runner-mocha"
  }
}
```

Or in `jest.config.js`
```js
module.exports = {
  runner: '@kernel-panic/jest-runner-mocha',
}
```

### Run Jest
```bash
npx jest
```

## Options

This project uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig), so you can provide config via:
* a `jest-runner-mocha` property in your `package.json`
* a `jest-runner-mocha.config.js` JS file
* a `.jest-runner-mocharc` JSON file


In `package.json`
```json
{
  "jest-runner-mocha": {
    "cliOptions": {
      // Options here
    },
    "coverageOptions": {
      // Options here
    }
  }
}
```

or in `jest-runner-mocha.config.js`
```js
module.exports = {
  cliOptions: {
    // Options here
  },
  "coverageOptions": {
    // Options here
  }
}
```


### cliOptions

jest-runner-mocha maps some mocha CLI arguments to config options. For example `--ui` is `cliOptions.ui`

|option|example
|-----|-----|
|ui|`"ui": "tdd"`
|timeout|`"timeout": 10000`
|compiler|`"compiler": "./path/to/babel-register"`
|file|`"file": ["./path/to/include.js", "/supports/multiple/files.js"`]

### coverageOptions

jest-runner-mocha has some optional configuration for code coverage

|option|example|description|
|-----|-----|-----|
|useBabelRc|`"useBabelRc": true`|read .babelrc when instrumenting for code coverage (required if you transpile your code with babel).|

### Coverage

Coverage works outside of the box, simply `npx jest -- --coverage`

You can also use other Jest options like [coveragePathIgnorePatterns](http://facebook.github.io/jest/docs/en/configuration.html#coveragepathignorepatterns-array-string) and [coverageReporters](http://facebook.github.io/jest/docs/en/configuration.html#coveragereporters-array-string)

### Custom clearMocks function

Just make an export with a clearMocks function in your `setupFilesAfterEnv`, like this:

```js
'use strict';

const sinon = require('sinon');

module.exports = {
	clearMocks: () => {
		sinon.sandbox.restore();
	}
};

```
