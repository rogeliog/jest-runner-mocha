const getFormattedAvaError = require('../internal/getFormattedAvaError');

const toTestResult = ({ meta, tests }) => {
  const numTests = tests.length;
  const numFailingTests = tests.filter(t => t.error).length;
  const numUnmatchedSnapshots = tests.reduce((sum, test) => {
    if (test.error && test.error.assertion === 'snapshot') {
      return sum + 1;
    }

    return sum;
  }, 0);
  const totalDuration = tests.reduce((sum, test) => sum + test.duration, 0);

  return {
    console: null,
    failureMessage: getFormattedAvaError(tests.find(t => t.error)),
    numFailingTests,
    numPassingTests: numTests - numFailingTests,
    numPendingTests: 0, // TODO: What should do here?
    perfStats: {
      end: meta.start + totalDuration / 1000,
      start: meta.start,
    },
    skipped: false,
    snapshot: {
      added: 0,
      fileDeleted: false,
      matched: 0,
      unchecked: 0,
      unmatched: numUnmatchedSnapshots,
      updated: 0,
    },
    sourceMaps: {},
    testExecError: null,
    testFilePath: meta.jestTest.path,
    testResults: tests.map(test => ({
      ancestorTitles: [],
      duration: test.duration / 1000,
      failureMessages: getFormattedAvaError(test),
      fullName: test.title,
      numPassingAsserts: test.error ? 1 : 0,
      status: test.error ? 'failed' : 'passed',
      title: test.title,
    })),
  };
};

module.exports = toTestResult;
