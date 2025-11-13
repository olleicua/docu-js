import '../src/docu.js';

const dv = window.docu.dynamicValue;

test('child can be set to a docu entity', () => {
  const child = new docu.State('initial');

  docu.append(document.body, <p>{dv(child)}</p>);

  expect(document.body.textContent).toMatch(/initial/);
  expect(document.querySelector('span')).toBe(null);

  child.set(<span>foo</span>);

  expect(document.body.textContent).not.toMatch(/initial/);
  console.log(document.body.innerHTML);
  expect(document.querySelector('span')).not.toBe(null);
});
