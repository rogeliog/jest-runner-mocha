/* eslint-disable no-unreachable */
const assert = require('assert');

describe('My tests', () => {
  it('This test passes', () => {
    assert.equal(1, 1);
  });

  describe('Nested describe', () => {
    beforeEach(() => {
      throw new Error('Error in nested beforeEach');
    });

    it('This nested test passes', () => {
      assert.equal(1, 1);
    });
  });
});
