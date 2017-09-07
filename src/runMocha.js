const Mocha = require('mocha');
const toTestResult = require('./utils/toTestResult');
const path = require('path');
const fs = require('fs');
const minimatch = require('minimatch');

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

const runMocha = ({ config, testPath, globalConfig }, workerCallback) => {
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
              coverage: global.__coverage__,
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

  if (globalConfig.collectCoverage) {
    const register = require('babel-register');
    register({
      plugins: [
        [
          'babel-plugin-istanbul',
          {
            // files outside `cwd` will not be instrumented
            cwd: config.rootDir,
            useInlineSourceMaps: false,
            exclude: config.coveragePathIgnorePatterns,
          },
        ],
      ],
      ignore: filename => {
        return (
          /node_modules/.test(filename) ||
          config.coveragePathIgnorePatterns.some(pattern =>
            minimatch(filename, pattern),
          )
        );
      },
      // ignore: filename => {
      //   console.log('ROGELIO', filename);
      //   // process.exit(1)
      //   // return ;
      //   return /node_modules/.match(filename) || filename.includes('runtime'),
      // },
      // Only js files in the test folder but not in the subfolder fixtures.
      // only: /packages\/.+\/test\/(?!fixtures\/).+\.js$/,
      babelrc: false,
      // compact: true,
      retainLines: true,
      sourceMaps: 'inline',
    });
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
