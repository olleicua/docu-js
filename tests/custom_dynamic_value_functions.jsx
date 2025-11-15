import '../src/docu.js';

const dv = window.docu.dynamicValue;

test('capitalize text', () => {
  const text = new docu.State('Alice');

  const capitalizedValue = dv(
    text,
    (t) => t.toUpperCase()
  );
  docu.append(document.body, <div>HELLO {capitalizedValue}!</div>);

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
  docu.append(document.body, <div>{repeatedValue}</div>);

  expect(document.body.textContent.match(/Foo/g).length).toBe(3);
  text.set('Bar');
  expect(document.body.textContent.match(/Bar/g).length).toBe(3);
  count.set(7);
  expect(document.body.textContent.match(/Bar/g).length).toBe(7);
});

test('multistate with JSX', () => {
  const className = new docu.State('foo');
  const strings = new docu.State(['abc', 'def']);

  const paragraphArray = dv(
    { c: className, s: strings },
    ({ c, s }) => <div>{s.map(str => <p className={c}>{str}</p>)}</div>
  );
  docu.append(document.body, <div>{paragraphArray}</div>);

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

  strings.set(strings.value.concat('ghi'));

  expect(document.querySelectorAll('.foo').length).toBe(0);
  expect(document.querySelectorAll('.bar').length).toBe(3);
  expect(document.body.textContent).toMatch(/abc/);
  expect(document.body.textContent).toMatch(/def/);
  expect(document.body.textContent).toMatch(/ghi/);
});
