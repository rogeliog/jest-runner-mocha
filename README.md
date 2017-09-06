# jest-runner-mocha

An experimental Mocha runner for Jest

This makes it easy to integrate existing Mocha projects with Jest.

![runner](https://user-images.githubusercontent.com/574806/30088955-728bf97e-925e-11e7-9b25-6aac237085ca.gif)


## Usage

### Install

Install `jest`_(it needs Jest 21+)_ and `jest-runner-mocha`

```bash
yarn add --dev jest jest-runner-mocha

# or with NPM

npm install --dev jest jest-runner-mocha

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

## Config options

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

_NOTE: Eventually Jest will eventually have an option for configuring runners that will eliminate the need for `jest-runner-mocha.config.js`_


## Known issues
- It does not support any Mocha options except for `ui` and `compiler`
- You can't run it with `jest --coverage`
- Support for compilers is very limited.
- Does not support `jest --runInBand`