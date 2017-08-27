import test from 'ava';

test('my passing test', t => {
  t.pass();
});

test('my second test', t => {
  t.deepEqual(1, 1);
});

test('my third test', t => {
  t.deepEqual(1, 2);
});

test('this one uses snapshots', t => {
  t.snapshot('Foo Bar Baz');
});
