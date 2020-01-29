const Mocha = require('mocha');
const toTestResult = require('./utils/toTestResult');
const setupCollectCoverage = require('./utils/setupCollectCoverage');
const getMochaOptions = require('./utils/getMochaOptions');

const runMocha = ({ config, testPath, globalConfig }, workerCallback) => {
  const { cliOptions: mochaOptions, coverageOptions } = getMochaOptions(config);
  let clearMocks;

  class Reporter extends Mocha.reporters.Base {
    constructor(runner) {
      super(runner);
      const tests = [];
      const pending = [];
      const failures = [];
      const passes = [];

      runner.on('suite', () => {
        if (clearMocks) {
          clearMocks();
        }
      });
      runner.on('test end', test => tests.push(test));
      runner.on('pass', test => passes.push(test));
      runner.on('fail', (test, err) => {
        test.err = err;
        failures.push(test);
      });
      runner.on('pending', test => pending.push(test));
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
    allowBabelRc: coverageOptions.useBabelRc,
  });

  if (config.setupFiles) {
    config.setupFiles.forEach(path => {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      const module = require(path);
      if (module.clearMocks) {
        clearMocks = module.clearMocks;
      }
    });
  }
  if (mochaOptions.file) {
    mochaOptions.file.forEach(file => mocha.addFile(file));
  }

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
