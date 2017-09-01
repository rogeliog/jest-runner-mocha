# jest-runner-mocha

An experimental test runner for Jest that runs Mocha tests within Jest.

## Usage

Install

```bash
yarn add --dev jest-runner-mocha
```

Add it to your Jest config

```js
module.exports = {
  runner: 'jest-runner-mocha',
}
```

Run Jest
```
yarn jest
```

## Config options

NOTE: Eventually Jest shoul have a `runnerConfig` option that will eliminate the need for `jest-runner-mocha.config.js`

Create a `jest-runner-mocha.config.js` at the `<rootDir>` or your Jest project.

- `ui`: (Optional) the UI used by mocha
```js
// example
module.exports = {
  ui: 'tdd',
}
```

- `compiler`: (Optional) the used for adding a compile step to your mocha tests

```js
// example
module.exports = {
  compiler: '/absolute/path/to/babel-register/or/other/compiler',
}
```


## Known issues
- It does not support Mocha options except for `ui` and `compiler`
- You can't run it with `jest --coverage`
- Support for compilers is very limited.
- Does not support `jest --runInBand`