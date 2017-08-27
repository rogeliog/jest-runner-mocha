# jest-runner-mocha

A highly experimental example test runner for Jest that runs Mocha tests within Jest.

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