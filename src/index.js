const apiCreator = require('./internal/apiCreator');
const toTestResult = require('./utils/toTestResult');

class CancelRun extends Error {
  constructor(message) {
    super(message);
    this.name = 'CancelRun';
  }
}

class AvaTestRunner {
  constructor(globalConfig) {
    this._globalConfig = globalConfig;
  }

  async runTests(tests, watcher, onStart, onResult, onFailure /* , options */) {
    const results = {};
    tests.forEach(test => {
      if (watcher.isInterrupted()) {
        throw new CancelRun();
      }
      onStart(test);
    });

    const rootDir = tests[0].context.config.rootDir;

    const ava = apiCreator({
      projectDir: rootDir,
      updateSnapshots: this._globalConfig.updateSnapshot === 'all',
    });

    const testPaths = tests.map(({ path }) => path);

    const findJestTest = avaFile =>
      tests.find(t =>
        t.path.replace(rootDir, '').includes(avaFile.replace('..', '')),
      );

    ava.on('test-run', async runStatus => {
      runStatus.on('stats', stats => {
        results[stats.file] = {
          meta: { start: +new Date() },
          stats,
          tests: [],
        };
      });

      runStatus.on('test', test => {
        const result = results[test.file];

        result.tests.push(test);
        result.meta.jestTest = findJestTest(test.file);
        if (result.stats.testCount === result.tests.length) {
          onResult(result.meta.jestTest, toTestResult(result));
        }
      });

      runStatus.on('error', error => {
        onFailure(findJestTest(error.file), error);
      });
    });

    return ava.run(testPaths);
  }
}
module.exports = AvaTestRunner;
