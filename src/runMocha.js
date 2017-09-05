const Mocha = require('mocha');
const toTestResult = require('./utils/toTestResult');
const path = require('path');
const fs = require('fs');

const getMochaOpts = config => {
  const mochaConfigPath = path.join(
    config.rootDir,
    'jest-runner-mocha.config.js',
  );

  if (fs.existsSync(mochaConfigPath)) {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(mochaConfigPath);
  }

  return {};
};

const runMocha = ({ config, testPath }, workerCallback) => {
  const mochaOptions = getMochaOpts(config);

  class Reporter extends Mocha.reporters.Base {
    constructor(runner) {
      super(runner);
      const tests = [];
      const pending = [];
      const failures = [];
      const passes = [];

      runner.on('test end', test => tests.push(test));
      runner.on('pass', test => passes.push(test));
      runner.on('fail', test => failures.push(test));
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
  });

  if (mochaOptions.compiler) {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    require(mochaOptions.compiler);
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
