const toTestResult = require('../toTestResult');

const start = +new Date('2000/01/01');
const filePath = '/path/to/file';

const jestTest = {
  path: 'path/to/file',
};

const passingTest = {
  duration: 1,
  title: 'This test passes[1]',
};

const passingTest2 = {
  duration: 4,
  title: 'This test also passes[2]',
};

const failingSnapshotTest = {
  duration: 2,
  error: {
    avaAssertionError: true,
    source: {
      isDependency: false,
      isWithinProject: true,
      file: '/path/to/file',
      line: 16,
    },
    stack:
      'AssertionError: Did not match snapshot\n    Test.t [as fn] (/path/to/file.js:16:5)\n    ',
    improperUsage: false,
    message: 'Did not match snapshot',
    name: 'AssertionError',
    statements: [],
    values: [
      {
        label: 'Difference:',
        formatted: "- 'Foo BarBaz'\n+ 'Foo Bar Baz'",
      },
    ],
    assertion: 'snapshot',
  },
  title: 'This test failed with a snapshot',
};

const failingTest = {
  duration: 4,
  error: {
    avaAssertionError: true,
    source: {
      isDependency: false,
      isWithinProject: true,
      file: '/path/to/file.js',
      line: 12,
    },
    stack: 'AssertionError\n    Test.t [as fn] (/path/to/file.js:12:5)\n    ',
    improperUsage: false,
    message: '',
    name: 'AssertionError',
    statements: [],
    values: [
      {
        label: 'Difference:',
        formatted: '- 1\n+ 2',
      },
    ],
    assertion: 'deepEqual',
  },
  title: 'This test failed',
};

it('turns a passing ava tests to Jest test result', () => {
  expect(
    toTestResult({
      meta: { start, jestTest },
      stats: {
        file: filePath,
      },
      tests: [passingTest],
    }),
  ).toMatchSnapshot();
});

it('turns a failing ava tests to Jest test result', () => {
  expect(
    toTestResult({
      meta: { start, jestTest },
      stats: {
        file: filePath,
      },
      tests: [failingTest],
    }),
  ).toMatchSnapshot();
});

it('turns a failing snapshot ava tests to Jest test result', () => {
  expect(
    toTestResult({
      meta: { start, jestTest },
      stats: {
        file: filePath,
      },
      tests: [failingSnapshotTest],
    }),
  ).toMatchSnapshot();
});

it('turns a whole ava tests suite to Jest test result', () => {
  expect(
    toTestResult({
      meta: { start, jestTest },
      stats: {
        file: filePath,
      },
      tests: [passingTest, failingSnapshotTest, passingTest2, failingTest],
    }),
  ).toMatchSnapshot();
});
