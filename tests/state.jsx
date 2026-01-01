import '../src/docu.js';

const { append, dynamicValue } = window.docu;

test('updating to a non-object state throws an exception', () => {
  let exceptionThrown = false;
  const state = new docu.State([1,2,3]);

  try {
    state.update({ foo: 1 });
  } catch (e) {
    exceptionThrown = true;
    expect(e).toBe('`update` can only be called on a State object whose value is ' +
		   'a plain obect or docu Entity');
  }

  expect(exceptionThrown).toBe(true);
});

test('updating an object state', () => {
  let listenerCalled = false;
  const obj = new docu.State({ a: 1, b: 2 });

  obj.listener.listen((value) => {
    listenerCalled = true;
    expect(value).toStrictEqual({ a: 1, b: 3, c: 4 });
  });

  obj.update({ b: 3, c: 4 });

  expect(listenerCalled).toBe(true);;
});

test('updating an Entity state', () => {
  let listenerCalled = false;
  const ent = new docu.State(<p>foo</p>);
  append(document.body, dynamicValue(ent));

  expect(document.querySelector('p').style.color).not.toBe('red');

  ent.update({ style: { color: 'red' } });

  expect(document.querySelector('p').style.color).toBe('red');
});

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
