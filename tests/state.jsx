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
		   'a plain obect or a DOM Node');
  }

  expect(exceptionThrown).toBe(true);
});

test('updating an object state with a non-object value throws an exception', () => {
  let exceptionThrown = false;
  const obj = new docu.State({ a: 1, b: 2 });

  try {
    obj.update(1);
  } catch (e) {
    exceptionThrown = true;
    expect(e).toBe(
      'the second argument to assignProperties can only be assigned using a plain object'
    );
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

  expect(listenerCalled).toBe(true);
});

test('updating a nested object state', () => {
  let listenerCalled = false;
  const obj = new docu.State({ a: 1, b: 2, q: { x: 'foo', y: 'bar' } });

  obj.listener.listen((value) => {
    listenerCalled = true;
    expect(value).toStrictEqual({ a: 1, b: 3, c: 4, q: { x: 'foo', y: 'baz' } });
  });

  obj.update({ b: 3, c: 4, q: { y: 'baz' } });

  expect(listenerCalled).toBe(true);
});

test('nested updating when the existing value doesnt have the nested state set', () => {
  let listenerCalled = false;
  const obj = new docu.State({ a: 1, b: 2 });

  obj.listener.listen((value) => {
    listenerCalled = true;
    expect(value).toStrictEqual({ a: 1, b: 3, c: 4, q: { y: 'baz' } });
  });

  obj.update({ b: 3, c: 4, q: { y: 'baz' } });

  expect(listenerCalled).toBe(true);
});

test('updating an DOM node state', () => {
  let listenerCalled = false;
  const ent = new docu.State(<p>foo</p>);
  append(document.body, dynamicValue(ent));

  expect(document.querySelector('p').className).not.toBe('foo');

  ent.update({ className: 'foo' });

  expect(document.querySelector('p').className).toBe('foo');
});

test('nested update to a DOM node state', () => {
  let listenerCalled = false;
  const ent = new docu.State(<p style={{ color: 'red', backgroundColor: 'blue' }}>foo</p>);
  append(document.body, dynamicValue(ent));

  expect(document.querySelector('p').style.color).toBe('red');
  expect(document.querySelector('p').style.backgroundColor).toBe('blue');
  expect(document.querySelector('p').style.margin).not.toBe('10px');

  ent.update({ style: { backgroundColor: 'black', margin: '10px' } });

  expect(document.querySelector('p').style.color).toBe('red');
  expect(document.querySelector('p').style.backgroundColor).toBe('black');
  expect(document.querySelector('p').style.margin).toBe('10px');
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

  expect(listenerCalled).toBe(true);
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
  expect(listenerCalled).toBe(true);
});

test('interpolating a state turns it into a dynamic value', () => {
  let paragraphClass = new docu.State('foo');
  document.body.append(<p className={paragraphClass}>xyz</p>);

  expect(document.querySelector('p').className).toBe('foo');

  paragraphClass.set('bar');

  expect(document.querySelector('p').className).toBe('bar');
});

test('interpolating state as a DOM node', () => {
  let node = new docu.State('foo');
  document.body.append(<p>{node}</p>);

  expect(document.querySelector('p').innerHTML).toBe('foo');

  node.set(<span>bar</span>);

  expect(document.querySelector('p').innerHTML).toBe('<span>bar</span>');
});
