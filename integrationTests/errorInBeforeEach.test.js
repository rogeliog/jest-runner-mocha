const runJest = require('./runJest');

it('Works when it has an error inside of beforeEach', () => {
  return expect(runJest('errorInBeforeEach')).resolves.toMatchSnapshot();
});
