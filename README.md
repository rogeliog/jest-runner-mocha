# jest-runner-mocha

[![Build Status](https://travis-ci.org/rogeliog/jest-runner-mocha.svg?branch=master)](https://travis-ci.org/rogeliog/jest-runner-mocha) [![npm version](https://badge.fury.io/js/jest-runner-mocha.svg)](https://badge.fury.io/js/jest-runner-mocha)

An experimental Mocha runner for Jest

This makes it easy to integrate existing Mocha projects with Jest.

![runner](https://user-images.githubusercontent.com/574806/30088955-728bf97e-925e-11e7-9b25-6aac237085ca.gif)


## Usage

### Install

Install `jest`_(it needs Jest 21+)_ and `jest-runner-mocha`

```bash
yarn add --dev jest jest-runner-mocha

# or with NPM

npm install --save-dev jest jest-runner-mocha

```

### Add it to your Jest config

In your `package.json`
```json
{
  "jest": {
    "runner": "jest-runner-mocha"
  }
}
```

Or in `jest.config.js`
```js
module.exports = {
  runner: 'jest-runner-mocha',
}
```

### Run Jest
```bash
yarn jest
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

Coverage works outside of the box, simply `yarn jest -- --coverage`

You can also use other Jest options like [coveragePathIgnorePatterns](http://facebook.github.io/jest/docs/en/configuration.html#coveragepathignorepatterns-array-string) and [coverageReporters](http://facebook.github.io/jest/docs/en/configuration.html#coveragereporters-array-string)
