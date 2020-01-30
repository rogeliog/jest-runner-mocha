const Mocha = require('mocha');
const toTestResult = require('./utils/toTestResult');
const setupCollectCoverage = require('./utils/setupCollectCoverage');
const getMochaOptions = require('./utils/getMochaOptions');

const runMocha = ({ config, testPath, globalConfig }) => {
  return new Promise((resolve, reject) => {
    const { cliOptions: mochaOptions, coverageOptions } = getMochaOptions(
      config,
    );
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
          test.err = err; // eslint-disable-line no-param-reassign
          failures.push(test);
        });
        runner.on('pending', test => pending.push(test));
        runner.on('end', () => {
          try {
            resolve(
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
            reject(e);
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

    if (config.setupFilesAfterEnv) {
      config.setupFilesAfterEnv.forEach(path => {
        // eslint-disable-next-line global-require,import/no-dynamic-require
        const module = require(path);
        if (config.clearMocks && module.clearMocks) {
          clearMocks = module.clearMocks;
        }
      });
    }
    if (mochaOptions.file) {
      mochaOptions.file.forEach(file => mocha.addFile(file));
    }

    mocha.addFile(testPath);

    try {
      if (mochaOptions.ui) {
        mocha.ui(mochaOptions.ui).run();
      } else {
        mocha.run();
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = runMocha;
