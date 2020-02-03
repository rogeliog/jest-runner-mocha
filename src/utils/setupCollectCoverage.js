const minimatch = require('minimatch');

const setupCollectCoverage = ({
  rootDir,
  collectCoverage,
  coveragePathIgnorePatterns,
  allowBabelRc,
}) => {
  if (!collectCoverage) {
    return;
  }

  // eslint-disable-next-line import/no-dynamic-require, global-require
  const register = require('@babel/register');
  register({
    plugins: [
      [
        'babel-plugin-istanbul',
        {
          // files outside `cwd` will not be instrumented
          cwd: rootDir,
          useInlineSourceMaps: false,
          exclude: coveragePathIgnorePatterns,
        },
      ],
    ],
    ignore: [
      /node_modules/,
      filename =>
        coveragePathIgnorePatterns.some(pattern =>
          minimatch(filename, pattern),
        ),
    ],
    babelrc: allowBabelRc,
    // compact: true,
    retainLines: true,
    sourceMaps: 'inline',
  });
};

module.exports = setupCollectCoverage;
