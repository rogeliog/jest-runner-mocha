const execa = require('execa');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const runJest = fixture => {
  return execa(
    'jest',
    [
      '--useStderr',
      '--no-watchman',
      '--no-cache',
      '--projects',
      path.join(__dirname, '__fixtures__', fixture),
    ],
    {
      env: process.env,
    },
  ).catch(t => t);
};

const normalize = output =>
  output
    .replace(/\(?\d*\.?\d+m?s\)?/g, '')
    .replace(/, estimated/g, '')
    .replace(new RegExp(rootDir, 'g'), '/mocked-path-to-jest-runner-mocha')
    .replace(/\s+\n/g, '\n');

it('Works when it has only passing tests', async () => {
  const { stderr } = await runJest('passing');
  expect(normalize(stderr)).toMatchSnapshot();
});

it('Works when it has a failing tests', async () => {
  const { stderr } = await runJest('failing');
  expect(normalize(stderr)).toMatchSnapshot();
});

it('Works when it throws an error', async () => {
  const { stderr } = await runJest('errorInTest');
  expect(normalize(stderr)).toMatchSnapshot();
});

it('Works when it throws an error outside the tests', async () => {
  const { stderr } = await runJest('errorOusideTest');
  expect(normalize(stderr)).toMatchSnapshot();
});
