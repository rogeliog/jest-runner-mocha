// const getFormattedAvaError = require('../internal/getFormattedAvaError');

const toMochaError = (test = {}) => {
  if (!test.err) {
    return null;
  }

  const { name, expected, actual } = test.err;

  return `
    ${name}
    + expected - actual

    -${actual}
    +${expected}
  `;
};

const toTestResult = ({ meta, tests }) => {
  const numTests = tests.length;
  const numFailingTests = tests.filter(t => t.state === 'failed').length;

  const totalDuration = tests.reduce(
    (sum, test) => sum + (test.duration || 0),
    0,
  );

  return {
    console: null,
    failureMessage: toMochaError(tests.find(t => t.state === 'failed')),
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
      unmatched: 0,
      updated: 0,
    },
    sourceMaps: {},
    testExecError: null,
    testFilePath: meta.jestTest.path,
    testResults: tests.map(test => {
      return {
        ancestorTitles: [],
        duration: test.duration / 1000,
        failureMessages: toMochaError(test),
        fullName: test.title,
        numPassingAsserts: test.error ? 1 : 0,
        status: test.state === 'passed' ? 'passed' : 'failed',
        title: test.title,
      };
    }),
  };
};

module.exports = toTestResult;
