const path = require('path');
const { cosmiconfigSync } = require('cosmiconfig');

function normalize(jestConfig, options) {
  const {
    cliOptions: rawCliOptions = {},
    coverageOptions = { allowBabelRc: false },
  } = options;
  const cliOptions = { ...rawCliOptions };

  if (cliOptions.compiler && !path.isAbsolute(cliOptions.compiler)) {
    cliOptions.compiler = path.resolve(jestConfig.rootDir, cliOptions.compiler);
  }

  if (cliOptions.file) {
    const file = [].concat(cliOptions.file);
    cliOptions.file = file.map(f => {
      if (path.isAbsolute(f)) {
        return f;
      }

      return path.resolve(jestConfig.rootDir, f);
    });
  }

  return { cliOptions, coverageOptions };
}

function getMochaOptions(jestConfig) {
  const explorerSync = cosmiconfigSync('jest-runner-mocha');
  const searchSyncResult = explorerSync.search();
  if (searchSyncResult && !searchSyncResult.isEmpty) {
    const result = explorerSync.load(searchSyncResult.filepath);
    if (result) {
      return normalize(jestConfig, result.config);
    }
  }

  return normalize(jestConfig, {});
}

module.exports = getMochaOptions;
