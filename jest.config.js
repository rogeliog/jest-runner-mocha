module.exports = {
  testPathIgnorePatterns: ['/examples/', '/node_modules/', '/__mocha__/'],
  testMatch: [
    '**/__tests__/**/*.js',
    '<rootDir>/integrationTests/*.test.js',
    '<rootDir>/integrationTests/**/*.test.js',
  ],
};
