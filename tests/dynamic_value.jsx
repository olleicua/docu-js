import '../src/docu.js';

const { dynamicValue, State } = window.docu;

test('multistate dynamic value requires a function', () => {
  let exceptionThrown = false;

  try {
    dynamicValue({ a: new State(0), b: new State(1) });
  } catch (e) {
    exceptionThrown = true;
    expect(e).toBe('multistate dynamic value requires a function');
  }

  expect(exceptionThrown).toBe(true);
});
