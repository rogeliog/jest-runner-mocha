const { spawn } = require('child_process');
const path = require('path');
const stripAnsi = require('strip-ansi');

const rootDir = path.join(__dirname, '..');

function spawnPromise(program2, args, options) {
  return new Promise(resolve => {
    const stdout = [];
    const stderr = [];
    const ps = spawn(program2, args, options);
    ps.stdout.on('data', newData => {
      stdout.push(newData);
    });

    ps.stderr.on('data', newData => {
      stderr.push(newData);
    });

    // eslint-disable-next-line no-unused-vars
    ps.on('close', code => {
      resolve({ stderr: stderr.join('\n'), stdout: stdout.join('\n') });
    });
  });
}

const normalize = output =>
  // to remove color codes which can not be disabled othervise
  stripAnsi(output)
    .replace(/\(?\d*\.?\d+m?s\)?/g, '')
    .replace(/, estimated/g, '')
    .replace(new RegExp(rootDir, 'g'), '/mocked-path-to-jest-runner-mocha')
    .replace(new RegExp('.*at .*\\n', 'g'), 'mocked-stack-trace')
    .replace(/.*at .*\\n/g, 'mocked-stack-trace')
    .replace(/(mocked-stack-trace)+/, '      at mocked-stack-trace')
    .replace(/\s+\n/g, '\n')
    .replace(/\s+/g, ' ')
    // sometimes random spaces are being added to test output at the end, remove them
    .split('\n')
    .map(line => line.trim())
    .join('\n');

const runJest = (project, options = []) => {
  // eslint-disable-next-line
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
  const projects = path.join(__dirname, '__fixtures__', project);
  const args = [
    './node_modules/.bin/jest',
    '--useStderr',
    '--no-watchman',
    '--no-cache',
    '--no-colors',
    '--projects',
    `${projects}`,
  ].concat(options);
  return spawnPromise('node', args, {
    // return exec(`node ./node_modules/.bin/jest ${args}`, {
    env: {
      ...process.env,
      // for chalk whick is used in jest
      FORCE_COLOR: 0,
      // for node native asserts. does not quite work.
      NODE_DISABLE_COLORS: 1,
      NO_COLOR: 1,
    },
  }).then(({ stdout, stderr }) => {
    return `${normalize(stderr)}\n${normalize(stdout)}`;
  });
};

module.exports = runJest;
