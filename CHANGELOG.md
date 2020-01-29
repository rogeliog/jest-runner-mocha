## master

## 1.1.1
* Only use clearMocks if option passed from jest.

## 1.1.0

* Add support for setupFiles jest option.
* Add support for custom clearMocks implementation and calls (see README).

## 1.0.0

* Fix Emitter issue.
* Allow using any version of mocha.

## 0.6.0

### Features
* Allow configuration of coverage babelrc usage ([#15](https://github.com/rogeliog/jest-runner-mocha/pull/15))
* Add ancestors to handle describe block nesting. ([#12](https://github.com/rogeliog/jest-runner-mocha/pull/12))

## 0.5.0

### Fixes

* Handle when an error occurs in a beforeEach block of a mocha test.
  ([#9](https://github.com/rogeliog/jest-runner-mocha/pull/9))
* Add support for file cliOptions arg.
  ([#8](https://github.com/rogeliog/jest-runner-mocha/pull/8))
