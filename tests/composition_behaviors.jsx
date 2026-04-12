import '../src/docu.js';

const { append, State, Listener, dynamicValue: dv } = window.docu;

// ─── Component composition ────────────────────────────────────────────────────

test('function components can be composed and nested', () => {
  const Badge = ({ label, color }) => (
    <span className="badge" style={{ color }}>{label}</span>
  );

  const UserCard = ({ name, role }) => (
    <div className="card">
      <strong>{name}</strong>
      <Badge label={role} color={role === 'admin' ? 'red' : 'blue'} />
    </div>
  );

  append(document.body, <UserCard name="Alice" role="admin" />);
  append(document.body, <UserCard name="Bob" role="user" />);

  const cards = document.querySelectorAll('.card');
  expect(cards.length).toBe(2);
  expect(cards[0].querySelector('.badge').textContent).toBe('admin');
  expect(cards[0].querySelector('.badge').style.color).toBe('red');
  expect(cards[1].querySelector('.badge').style.color).toBe('blue');
  // should this also check that the names are present? why or why not?
});

test('function component receives and renders dynamic children', () => {
  const Panel = ({ title, children }) => (
    <section>
      <h2 className="panel-title">{title}</h2>
      <div className="panel-body">{children}</div>
    </section>
  );

  append(document.body, (
    <Panel title="My Panel">
      <p>First</p>
      <p>Second</p>
    </Panel>
  ));

  expect(document.querySelector('.panel-title').textContent).toBe('My Panel');
  expect(document.querySelectorAll('.panel-body p').length).toBe(2);
});

// ─── Listener as event bus ────────────────────────────────────────────────────

test('a Listener acts as a decoupled event bus between components', () => {
  const saveClicked = new Listener();

  let saveCount = 0;
  let lastPayload = null;

  saveClicked.listen(payload => {
    saveCount++;
    lastPayload = payload;
  });

  append(document.body, (
    <button id="save" onClick={() => saveClicked.send({ item: `xyz-${saveCount}` })}>
      Save
    </button>
  ));

  expect(saveCount).toBe(0);

  document.getElementById('save').click();
  expect(saveCount).toBe(1);
  expect(lastPayload).toStrictEqual({ item: 'xyz-0' });

  document.getElementById('save').click();
  expect(saveCount).toBe(2);
  expect(lastPayload).toStrictEqual({ item: 'xyz-1' });
});

// ─── Fragment behaviors ───────────────────────────────────────────────────────

test('dynamic value that returns a fragment replaces correctly', () => {
  const view = new State('list');

  append(document.body, (
    <div id="app">
      {dv(view, v => {
        if (v === 'list') return (
          <>
            <p className="item">A</p>
            <p className="item">B</p>
          </>
        );
        return <p className="empty">Nothing here</p>;
      })}
    </div>
  ));

  expect(document.querySelectorAll('.item').length).toBe(2);
  expect(document.querySelector('.empty')).toBeNull();

  view.set('empty');

  expect(document.querySelectorAll('.item').length).toBe(0);
  expect(document.querySelector('.empty')).not.toBeNull();

  view.set('list');

  expect(document.querySelectorAll('.item').length).toBe(2);
  expect(document.querySelector('.empty')).toBeNull();
});

test('empty fragment appended to body adds no nodes', () => {
  const before = document.body.childNodes.length;
  append(document.body, <></>);
  expect(document.body.childNodes.length).toBe(before);
});

// ─── Error cases ──────────────────────────────────────────────────────────────

test('appending an invalid child type throws a clear error', () => {
  expect(() => append(document.body, 42)).toThrow();
  expect(() => append(document.body, { type: 'invalid' })).toThrow();
});
// I'm on the fence about whether a number should automatically be converted to a string here
// give me some pros and cons

test('State#push and pop on a non-array throw descriptive errors', () => {
  const s = new State('not an array');
  expect(() => s.push(1)).toThrow('`push` can only be called on a State object whose value is an array');
  expect(() => s.pop()).toThrow('`pop` can only be called on a State object whose value is an array');
});

test('State#update on a non-object throws a descriptive error', () => {
  const s = new State([1, 2, 3]);
  expect(() => s.update({ foo: 1 })).toThrow();
});

test('multistate dynamicValue without a function throws a descriptive error', () => {
  const a = new State(1);
  const b = new State(2);
  expect(() => dv({ a, b })).toThrow('multistate dynamic value requires a function');
});
