const Mocha = require('mocha');
const omit = require('lodash/omit');
const path = require('path');
const toTestResult = require('./utils/toTestResult');

// const testPath = process.argv[2];

function clean(test) {
  return {
    title: test.title,
    fullTitle: test.fullTitle(),
    duration: test.duration,
    currentRetry: test.currentRetry(),
    err: test.err,
  };
}

const runMocha = (options, workerCallback) => {
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
        const results = {
          stats: this.stats,
          tests: tests.map(clean),
          pending: pending.map(clean),
          failures: failures.map(clean),
          passes: passes.map(clean),
          jestTestPath: options.path,
        };

        try {
          workerCallback(null, toTestResult(results));
        } catch (e) {
          workerCallback(e);
        }
      });
    }

    // eslint-disable-next-line
    // epilogue() {}
  }

  const mocha = new Mocha({
    // ui: 'tdd',
    reporter: Reporter,
  });

  require('/Users/rogelioguzman/dev/babel/scripts/babel-register');
  mocha.addFile(options.path);

  mocha.ui('tdd').run(() => {
    process.on('exit', () => {
      process.exit();
    });
  });
};

module.exports = runMocha;
