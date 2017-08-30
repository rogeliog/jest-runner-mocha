const throat = require('throat');
const execa = require('execa');
const path = require('path');

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
            .then(result => {
              // console.log(result);
              onResult(test, result);
            })
            .catch(e => onFailure(test, e));
        }),
      ),
    );
  }

  // eslint-disable-next-line
  async _runTest(test) {
    return execa('node', [path.join(__dirname, 'runMocha.js'), test.path], {
      env: process.env,
    }).then(({ stdout }) => JSON.parse(stdout));
    // .then(console.log); // JSON.parse(stdout));
    // })
    //   .then(a => console.log(a))
    //   .catch(a => console.log('ERROR', a));
  }
}
module.exports = MochaTestRunner;
