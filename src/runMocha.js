const Mocha = require('mocha');
const omit = require('lodash/omit');
const toTestResult = require('./utils/toTestResult');

const testPath = process.argv[2];

function clean(test) {
  return {
    title: test.title,
    fullTitle: test.fullTitle(),
    duration: test.duration,
    currentRetry: test.currentRetry(),
    err: test.err,
  };
}

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
        jestTestPath: testPath,
      };

      try {
        // console.log(results.failures[0].err instanceof Error);
        process.stdout.write(JSON.stringify(toTestResult(results), null, 2));
      } catch (e) {
        console.log(e);
      }
    });
  }

  // eslint-disable-next-line
  // epilogue() {}
}

const mocha = new Mocha({ reporter: Reporter });
mocha.addFile(testPath);

mocha.run(() => {
  process.on('exit', () => {
    process.exit();
  });
});
