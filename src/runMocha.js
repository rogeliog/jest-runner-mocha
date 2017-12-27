const Mocha = require('mocha');
const toTestResult = require('./utils/toTestResult');
const setupCollectCoverage = require('./utils/setupCollectCoverage');
const getMochaOptions = require('./utils/getMochaOptions');

const runMocha = ({ config, testPath, globalConfig }, workerCallback) => {
  const { cliOptions: mochaOptions } = getMochaOptions(config);

  class Reporter extends Mocha.reporters.Base {
    constructor(runner) {
      super(runner);
      const tests = new Set();
      const pending = new Set();
      const failures = new Set();
      const passes = new Set();

      runner.on('test end', test => tests.add(test));
      runner.on('pass', test => passes.add(test));
      runner.on('fail', (test, err) => {
        test.err = err;
        failures.add(test);

        // Ensure we include failing tests in our final set of tests.
        tests.add(test);
      });
      runner.on('pending', test => pending.add(test));
      runner.on('end', () => {
        try {
          workerCallback(
            null,
            toTestResult({
              stats: this.stats,
              tests,
              pending,
              failures,
              passes,
              coverage: global.__coverage__,
              jestTestPath: testPath,
            }),
          );
        } catch (e) {
          workerCallback(e);
        }
      });
    }
  }

  const mocha = new Mocha({
    reporter: Reporter,
    timeout: mochaOptions.timeout,
  });

  if (mochaOptions.compiler) {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    require(mochaOptions.compiler);
  }

  setupCollectCoverage({
    filename: testPath,
    rootDir: config.rootDir,
    collectCoverage: globalConfig.collectCoverage,
    coveragePathIgnorePatterns: config.coveragePathIgnorePatterns,
  });

  mocha.addFile(testPath);

  const onEnd = () => {
    process.on('exit', () => process.exit());
  };

  try {
    if (mochaOptions.ui) {
      mocha.ui(mochaOptions.ui).run(onEnd);
    } else {
      mocha.run(onEnd);
    }
  } catch (e) {
    workerCallback(e);
  }
};

module.exports = runMocha;
