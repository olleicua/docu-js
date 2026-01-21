import '../src/docu.js';

const { append, dynamicValue: dv } = window.docu;

test('child can be set to a DOM Element', () => {
  const child = new docu.State('initial');

  append(document.body, <p>{dv(child)}</p>);

  expect(document.body.textContent).toMatch(/initial/);
  expect(document.querySelector('br')).toBe(null);

  child.set(<br />);

  expect(document.body.textContent).not.toMatch(/initial/);
  expect(document.querySelector('br')).not.toBe(null);
});

test('child can be set to a string', () => {
  const child = new docu.State(<span>initial</span>);

  append(document.body, <p>{dv(child)}</p>);

  expect(document.body.textContent).toMatch(/initial/);
  expect(document.body.textContent).not.toMatch(/foobar/);
  expect(document.querySelector('span')).not.toBe(null);

  child.set('foobar');

  expect(document.body.textContent).not.toMatch(/initial/);
  expect(document.querySelector('span')).toBe(null);
  expect(document.body.textContent).toMatch(/foobar/);
});

test('child cannot be set to a value other than a String or Node', () => {
  const child = new docu.State('initial');

  append(document.body, <p>{dv(child)}</p>);

  expect(document.body.textContent).toMatch(/initial/);

  let exceptionThrown = false;

  try {
    child.set({ type: 'other' });
  } catch (e) {
    exceptionThrown = true;
    expect(e).toBe(
      'object in a child element context must be a docu Fragment, ' +
	'a string, a DOM Node, or an Array of such objects'
    );
  }

  expect(exceptionThrown).toBe(true);
});

test('child cannot be set to a dynamic value object', () => {
  const child = new docu.State('initial');

  append(document.body, <p>{dv(child)}</p>);

  expect(document.body.textContent).toMatch(/initial/);

  let exceptionThrown = false;

  try {
    child.set(dv(new docu.State(1)));
  } catch (e) {
    exceptionThrown = true;
    expect(e).toBe(
      'object in a child element context must be a docu Fragment, ' +
	'a string, a DOM Node, or an Array of such objects'
    );
  }

  expect(exceptionThrown).toBe(true);
});
