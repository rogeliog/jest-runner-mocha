const path = require('path');
const cosmiconfig = require('cosmiconfig');

const explorer = cosmiconfig('jest-runner-mocha', { sync: true });

const normalize = (jestConfig, { cliOptions: rawCliOptions = {} }) => {
  const cliOptions = Object.assign({}, rawCliOptions);

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

  return { cliOptions };
};

const getMochaOptions = jestConfig => {
  const result = explorer.load(jestConfig.rootDir);

  if (result) {
    return normalize(jestConfig, result.config);
  }

  return normalize(jestConfig, {});
};

module.exports = getMochaOptions;
