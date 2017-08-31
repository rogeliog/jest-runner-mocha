const throat = require('throat');
const pify = require('pify');
const workerFarm = require('worker-farm');
const execa = require('execa');
const path = require('path');

const TEST_WORKER_PATH = path.join(__dirname, 'runMocha.js');

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
    const farm = workerFarm(
      {
        autoStart: true,
        maxConcurrentCallsPerWorker: 1,
        maxConcurrentWorkers: this._globalConfig.maxWorkers,
        maxRetries: 2, // Allow for a couple of transient errors.
      },
      TEST_WORKER_PATH,
    );
    const mutex = throat(this._globalConfig.maxWorkers);
    const worker = pify(farm);
    const runTestInWorker = test =>
      mutex(async () => {
        if (watcher.isInterrupted()) {
          throw new CancelRun();
        }
        await onStart(test);
        return worker({
          config: test.context.config,
          globalConfig: this._globalConfig,
          path: test.path,
          rawModuleMap: watcher.isWatchMode()
            ? test.context.moduleMap.getRawModuleMap()
            : null,
        });
      });

    const onError = async (err, test) => {
      await onFailure(test, err);
      if (err.type === 'ProcessTerminatedError') {
        console.error(
          'A worker process has quit unexpectedly! ' +
            'Most likely this is an initialization error.',
        );
        process.exit(1);
      }
    };

    const onInterrupt = new Promise((_, reject) => {
      watcher.on('change', state => {
        if (state.interrupted) {
          reject(new CancelRun());
        }
      });
    });

    const runAllTests = Promise.all(
      tests.map(test =>
        runTestInWorker(test)
          .then(testResult => onResult(test, testResult))
          .catch(error => onError(error, test)),
      ),
    );

    const cleanup = () => workerFarm.end(farm);

    return Promise.race([runAllTests, onInterrupt]).then(cleanup, cleanup);
  }

  // eslint-disable-next-line
  async _runTest(test) {
    // return execa('node', , test.path], {
    //   env: process.env,
    // }).then(({ stdout }) => JSON.parse(stdout));
    // .then(console.log); // JSON.parse(stdout));
    // })
    //   .then(a => console.log(a))
    //   .catch(a => console.log('ERROR', a));
  }
}
module.exports = MochaTestRunner;
