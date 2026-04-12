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

  const input2 = document.getElementById('input2');
  input2.value = 'world';
  input2.dispatchEvent(new KeyboardEvent('keyup'));

  expect(document.getElementById('input1').value).toBe('world');
  expect(document.getElementById('preview').textContent).toBe('world');
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
  const todos = new State(['one', 'two', 'three', 'four', 'five']);

  append(document.body, (
    <ul id="todos">
      {dv(todos, list =>
        list.map((item, i) => (
          <li className="todo">
            <span className="label">{item}</span>
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

  const getLabels = () =>
    [...document.querySelectorAll('#todos .label')].map(el => el.textContent);

  expect(getLabels()).toStrictEqual(['one', 'two', 'three', 'four', 'five']);

  // remove the fourth item ('four')
  const lisBefore = document.querySelectorAll('#todos .todo');
  expect(lisBefore[3].querySelector('.label').textContent).toBe('four');
  lisBefore[3].querySelector('.remove').click();
  expect(getLabels()).toStrictEqual(['one', 'two', 'three', 'five']);

  // remove the second item ('two')
  const lisAfterFirst = document.querySelectorAll('#todos .todo');
  expect(lisAfterFirst[1].querySelector('.label').textContent).toBe('two');
  lisAfterFirst[1].querySelector('.remove').click();
  expect(getLabels()).toStrictEqual(['one', 'three', 'five']);

  // remove the third item in the current list ('five')
  const lisAfterSecond = document.querySelectorAll('#todos .todo');
  expect(lisAfterSecond[2].querySelector('.label').textContent).toBe('five');
  lisAfterSecond[2].querySelector('.remove').click();
  expect(getLabels()).toStrictEqual(['one', 'three']);
});

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
