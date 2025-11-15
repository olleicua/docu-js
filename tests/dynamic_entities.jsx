import '../src/docu.js';

const dv = window.docu.dynamicValue;

test('child can be set to a docu entity', () => {
  const initial = document.createElement('div');
  initial.textContent = 'initial';
  initial.className = 'foo';
  const child = new docu.State(initial);

  docu.append(document.body, <p>{dv(child)}</p>);

  expect(document.body.textContent).toMatch(/initial/);
  expect(document.querySelector('.foo')).not.toBe(null);
  expect(document.querySelector('span')).toBe(null);

  child.set(<span>foo</span>);

  expect(document.body.textContent).not.toMatch(/initial/);
  expect(document.querySelector('.foo')).toBe(null);
  expect(document.querySelector('span')).not.toBe(null);
});

test('child can be set to a DOM Element', () => {
  const child = new docu.State('initial');

  docu.append(document.body, <p>{dv(child)}</p>);

  expect(document.body.textContent).toMatch(/initial/);
  expect(document.querySelector('br')).toBe(null);

  child.set(document.createElement('br'));

  expect(document.body.textContent).not.toMatch(/initial/);
  expect(document.querySelector('br')).not.toBe(null);
});

test('child can be set to a string', () => {
  const child = new docu.State(<span>initial</span>);

  docu.append(document.body, <p>{dv(child)}</p>);

  expect(document.body.textContent).toMatch(/initial/);
  expect(document.body.textContent).not.toMatch(/foobar/);
  expect(document.querySelector('span')).not.toBe(null);

  child.set('foobar');

  expect(document.body.textContent).not.toMatch(/initial/);
  expect(document.querySelector('span')).toBe(null);
  expect(document.body.textContent).toMatch(/foobar/);
});

test('child cannot be set to a value other than a String, Entity, or Node', () => {
  const child = new docu.State('initial');

  docu.append(document.body, <p>{dv(child)}</p>);

  expect(document.body.textContent).toMatch(/initial/);

  let exceptionThrown = false;

  try {
    child.set({ type: 'other' });
  } catch (e) {
    exceptionThrown = true;
    expect(e).toBe(
      'Dynamic value in child element context must be set to a docu Entity, a string, or a DOM Node'
    );
  }

  expect(exceptionThrown).toBe(true);
});
