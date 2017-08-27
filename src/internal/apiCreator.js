const AvaAPI = require('ava/api');

/**
 * Original function in avajs/ava https://github.com/avajs/ava/blob/465fcecc9ae0d3274d4d41d3baaca241d6a40130/test/api.js#L13
 */
function apiCreator(options = {}) {
  const newOptions = Object.assign(
    {
      babelConfig: 'default',
      powerAssert: true,
      resolveTestsFrom: options.projectDir,
    },
    options,
  );

  const instance = new AvaAPI(newOptions);

  if (!options.precompileHelpers) {
    instance._precompileHelpers = () => Promise.resolve();
  }

  return instance;
}

module.exports = apiCreator;
