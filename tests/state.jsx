import '../src/docu.js';

const { append, dynamicValue } = window.docu;

test('pushing to a non-array state throws an exception', () => {
  let exceptionThrown = false;
  const state = new docu.State('foobar');

  try {
    state.push(1);
  } catch (e) {
    exceptionThrown = true;
    expect(e).toBe('`push` can only be called on a State object whose value is an array');
  }

  expect(exceptionThrown).toBe(true);
});

test('pushing to an array state', () => {
  let listenerCalled = false;
  const array = new docu.State([1]);

  array.listener.listen((value) => {
    listenerCalled = true;
    expect(value).toStrictEqual([1, 2]);
  });

  array.push(2);

  expect(listenerCalled).toBe(true);;
});

test('popping from a non-array state throws an exception', () => {
  let exceptionThrown = false;
  const state = new docu.State('foobar');

  try {
    state.pop();
  } catch (e) {
    exceptionThrown = true;
    expect(e).toBe('`pop` can only be called on a State object whose value is an array');
  }

  expect(exceptionThrown).toBe(true);
});

test('popping from an array state', () => {
  let listenerCalled = false;
  const array = new docu.State([1, 2]);

  array.listener.listen((value) => {
    listenerCalled = true;
    expect(value).toStrictEqual([1]);
  });

  const last = array.pop();

  expect(last).toBe(2);
  expect(listenerCalled).toBe(true);;
});
