const execa = require('execa');
const path = require('path');

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
    .replace(/\d*\.?\d+m?s/g, '<<REPLACED>>')
    .replace(/, estimated <<REPLACED>>/g, '');

it('Works when it has only passing tests', async () => {
  const { stderr } = await runJest('passing');
  expect(normalize(stderr)).toMatchSnapshot();
});

it('Works when it has a failing tests', async () => {
  const { stderr } = await runJest('failing');
  expect(normalize(stderr)).toMatchSnapshot();
});
