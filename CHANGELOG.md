## master

## 3.0.0

Update all deps (can be breaking change), remove lock files, fix tests.

Should be more stable now.

## 2.1.2

* Fix error messages display.

## 2.1.1

* Remove packages which are not used any more.

## 2.1.0

* Use create-jest-runner from [patrickdawson](https://github.com/patrickdawson/jest-runner-mocha).

## 2.0.1

* Use npm-shrinkwrap.json to fix transitive deps and testing without yarn. ([#26](https://github.com/rogeliog/jest-runner-mocha/issues/26))

## 2.0.0

* Drop node 4 support, get rid of build process and babel.

## 1.1.2
* Replace setupFiles with setupFilesAfterEnv option.

## 1.1.1
* Only use clearMocks if option passed from jest.

## 1.1.0

* Add support for setupFiles jest option.
* Add support for custom clearMocks implementation and calls (see README). ([#24](https://github.com/rogeliog/jest-runner-mocha/issues/24))

## 1.0.0

* Fix Emitter issue. ([#21](https://github.com/rogeliog/jest-runner-mocha/issues/21))
* Allow using any version of mocha. ([#6](https://github.com/rogeliog/jest-runner-mocha/issues/6))

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
