const Mocha = require('mocha');
const toTestResult = require('./utils/toTestResult');
const throat = require('throat');
const execa = require('execa');

class CancelRun extends Error {
  constructor(message) {
    super(message);
    this.name = 'CancelRun';
  }
}

class MochaTestRunner {
  constructor(globalConfig) {
    this._globalConfig = globalConfig;
  }

  // eslint-disable-next-line
  async runTests(tests, watcher, onStart, onResult, onFailure /* , options */) {
    const mutex = throat(this._globalConfig.maxWorkers);
    return Promise.all(
      tests.map(test =>
        mutex(async () => {
          if (watcher.isInterrupted()) {
            throw new CancelRun();
          }

          await onStart(test);

          return this._runTest(test)
            .then(result => onResult(test, result))
            .catch(e => onFailure(test, e));
        }),
      ),
    );
  }

  // eslint-disable-next-line
  async _runTest(test) {
    return new Promise(resolve => {
      class Reporter extends Mocha.reporters.Base {
        constructor(runner) {
          super(runner);
          const results = {};
          runner.on('suite', suite => {
            if (suite.file) {
              try {
                results[suite.file] = {
                  meta: {
                    start: +new Date(),
                    jestTest: test,
                  },
                };
              } catch (e) {
                console.log(e);
              }
            }
          });

          runner.on('suite end', suite => {
            if (suite.file) {
              const result = results[suite.file];
              result.tests = suite.tests;
              try {
                // console.log(toTestResult(result));
                resolve(toTestResult(result));
              } catch (e) {
                console.log(e);
              }
            }
          });
        }
        // eslint-disable-next-line
        epilogue() {}
      }

      const mocha = new Mocha({ reporter: Reporter });
      mocha.addFile(test.path);

      mocha.run(failures => {
        process.on('exit', () => {
          process.exit(failures);
        });
      });
    });
  }
}
module.exports = MochaTestRunner;
