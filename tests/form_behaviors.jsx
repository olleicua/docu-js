import '../src/docu.js';

const { append, State, dynamicValue: dv } = window.docu;

test('two inputs stay in sync when bound to the same state', () => {
  const text = new State('');

  append(document.body, (
    <>
      <input id="input1" value={text} onKeyUp={e => text.set(e.target.value)} />
      <input id="input2" value={text} onKeyUp={e => text.set(e.target.value)} />
      <p id="preview">{text}</p>
    </>
  ));

  const input1 = document.getElementById('input1');
  input1.value = 'hello';
  input1.dispatchEvent(new KeyboardEvent('keyup'));

  expect(document.getElementById('input2').value).toBe('hello');
  expect(document.getElementById('preview').textContent).toBe('hello');
});
// this should also test the behavior when input2 is modified

test('a counter increments and decrements correctly', () => {
  const count = new State(0);

  // numeric state must be converted to string for use as a DOM child
  append(document.body, (
    <>
      <button id="dec" onClick={() => count.set(count.value - 1)}>-</button>
      <span id="count">{dv(count, n => String(n))}</span>
      <button id="inc" onClick={() => count.set(count.value + 1)}>+</button>
    </>
  ));
  // if we decide to automatically convert numbers to strings then this could be simplified to <span id="count">{n}</span>

  expect(document.getElementById('count').textContent).toBe('0');

  document.getElementById('inc').click();
  document.getElementById('inc').click();
  document.getElementById('inc').click();
  expect(document.getElementById('count').textContent).toBe('3');

  document.getElementById('dec').click();
  expect(document.getElementById('count').textContent).toBe('2');
});

test('a todo list can add and remove items via buttons', () => {
  const todos = new State(['Buy milk', 'Walk dog']);

  append(document.body, (
    <ul id="todos">
      {dv(todos, list =>
        list.map((item, i) => (
          <li>
            {item}
            <button
              className="remove"
              onClick={() => todos.set(todos.value.filter((_, j) => j !== i))}
            >
              x
            </button>
          </li>
        ))
      )}
    </ul>
  ));

  expect(document.querySelectorAll('#todos li').length).toBe(2);

  // Remove the first item
  document.querySelectorAll('.remove')[0].click();

  expect(document.querySelectorAll('#todos li').length).toBe(1);
  expect(document.getElementById('todos').textContent).toMatch(/Walk dog/);
  expect(document.getElementById('todos').textContent).not.toMatch(/Buy milk/);
});
// im nervous about the variable i in the closure here.. and also indices in a changing list make the list have five elements and then remove the fourth and then make sure that behaves correctly and then remove the second and make sure that behaves correctly and then remove the third and make sure that behaves correctly. the result should be that the first and third items from the original list remain
// also instead of finding the nth remove button, find the nth li and make sure it has the expected text in it before removing it.. this is exactly the type of complexity that leads to bugs

test('a toggle button flips boolean state correctly', () => {
  const on = new State(false);

  append(document.body, (
    <>
      <button id="toggle" onClick={() => on.set(!on.value)}>Toggle</button>
      <p id="status">{dv(on, v => v ? 'ON' : 'OFF')}</p>
    </>
  ));

  expect(document.getElementById('status').textContent).toBe('OFF');

  document.getElementById('toggle').click();
  expect(document.getElementById('status').textContent).toBe('ON');

  document.getElementById('toggle').click();
  expect(document.getElementById('status').textContent).toBe('OFF');
});

test('computed value derived from two states updates when either changes', () => {
  const price = new State(10);
  const quantity = new State(3);

  append(document.body, (
    <p id="total">
      {dv({ price, quantity }, ({ price, quantity }) => `Total: $${price * quantity}`)}
    </p>
  ));

  expect(document.getElementById('total').textContent).toBe('Total: $30');

  price.set(20);
  expect(document.getElementById('total').textContent).toBe('Total: $60');

  quantity.set(1);
  expect(document.getElementById('total').textContent).toBe('Total: $20');
});
