import '../src/docu.js';

const { append, dynamicValue: dv } = window.docu;

test('capitalize text', () => {
  const text = new docu.State('Alice');

  const capitalizedValue = dv(
    text,
    (t) => t.toUpperCase()
  );
  append(document.body, <div>HELLO {capitalizedValue}!</div>);

  expect(document.body.textContent).toMatch(/HELLO ALICE!/);
  text.set('bob');
  expect(document.body.textContent).toMatch(/HELLO BOB!/);
});

test('multistate function', () => {
  const text = new docu.State('Foo');
  const count = new docu.State(3);

  const repeatedValue = dv(
    { t: text, c: count },
    ({ t, c }) => t.repeat(c)
  );
  append(document.body, <div>{repeatedValue}</div>);

  expect(document.body.textContent.match(/Foo/g).length).toBe(3);

  text.set('Bar');

  expect(document.body.textContent.match(/Bar/g).length).toBe(3);

  count.set(7);

  expect(document.body.textContent.match(/Bar/g).length).toBe(7);
});

test('multistate function with invalid state object throws error', () => {
  let exceptionThrown = false;

  const text = new docu.State('Foo');
  const count = new docu.State(3);

  try {
    const repeatedValue = dv(
      { t: text, c: count, xyz: { nonStateObject: true } },
      ({ t, c }) => t.repeat(c)
    );
  } catch (e) {
    exceptionThrown = true;
    expect(e).toBe(
      'the first argument to dynamicValue must be either a State object ' +
	'or an object whose values are all State objects'
    );
  }

  expect(exceptionThrown).toBe(true);

});

test('multistate with an array of entities', () => {
  const className = new docu.State('foo');
  const strings = new docu.State(['abc', 'def']);

  const paragraphArray = dv(
    { c: className, s: strings },
    ({ c, s }) => s.map(str => <p className={c}>{str}</p>)
  );
  append(document.body, paragraphArray);

  expect(document.querySelectorAll('.foo').length).toBe(2);
  expect(document.querySelectorAll('.bar').length).toBe(0);
  expect(document.body.textContent).toMatch(/abc/);
  expect(document.body.textContent).toMatch(/def/);
  expect(document.body.textContent).not.toMatch(/ghi/);

  className.set('bar');

  expect(document.querySelectorAll('.foo').length).toBe(0);
  expect(document.querySelectorAll('.bar').length).toBe(2);
  expect(document.body.textContent).toMatch(/abc/);
  expect(document.body.textContent).toMatch(/def/);
  expect(document.body.textContent).not.toMatch(/ghi/);

  strings.push('ghi');

  expect(document.querySelectorAll('.foo').length).toBe(0);
  expect(document.querySelectorAll('.bar').length).toBe(3);
  expect(document.body.textContent).toMatch(/abc/);
  expect(document.body.textContent).toMatch(/def/);
  expect(document.body.textContent).toMatch(/ghi/);

  const last = strings.pop();
  expect(last).toBe('ghi');

  expect(document.querySelectorAll('.foo').length).toBe(0);
  expect(document.querySelectorAll('.bar').length).toBe(2);
  expect(document.body.textContent).toMatch(/abc/);
  expect(document.body.textContent).toMatch(/def/);
  expect(document.body.textContent).not.toMatch(/ghi/);
});
