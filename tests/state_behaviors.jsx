import '../src/docu.js';

const { append, State, dynamicValue: dv } = window.docu;

test('multiple components can bind to the same state and all update together', () => {
  const username = new State('alice');

  append(document.body, (
    <>
      <h1 id="heading">{dv(username, n => `Welcome, ${n}`)}</h1>
      <p id="para">{dv(username, n => `Logged in as: ${n}`)}</p>
      <span id="nav">{username}</span>
    </>
  ));

  expect(document.getElementById('heading').textContent).toBe('Welcome, alice');
  expect(document.getElementById('para').textContent).toBe('Logged in as: alice');
  expect(document.getElementById('nav').textContent).toBe('alice');

  username.set('bob');

  expect(document.getElementById('heading').textContent).toBe('Welcome, bob');
  expect(document.getElementById('para').textContent).toBe('Logged in as: bob');
  expect(document.getElementById('nav').textContent).toBe('bob');
});

test('state change only re-renders affected parts of the DOM, not siblings', () => {
  let renderCount = 0;
  const name = new State('alice');

  append(document.body, (
    <ul>
      <li id="static">I never change</li>
      <li id="dynamic">{dv(name, n => { renderCount++; return n; })}</li>
    </ul>
  ));

  expect(renderCount).toBe(1);
  name.set('bob');
  expect(renderCount).toBe(2);
  expect(document.getElementById('static').textContent).toBe('I never change');
  expect(document.getElementById('dynamic').textContent).toBe('bob');
});
// this test is a misleading. it does nothing to confirm whether the first li is re-rendered or not

test('a list can have items added and removed dynamically', () => {
  const items = new State(['apples', 'bananas']);

  append(document.body, (
    <ul id="list">
      {dv(items, list => list.map(item => <li>{item}</li>))}
    </ul>
  ));

  expect(document.querySelectorAll('#list li').length).toBe(2);

  items.push('cherries');
  expect(document.querySelectorAll('#list li').length).toBe(3);
  expect(document.getElementById('list').textContent).toMatch(/cherries/);

  items.pop();
  expect(document.querySelectorAll('#list li').length).toBe(2);
  expect(document.getElementById('list').textContent).not.toMatch(/cherries/);
});
// why not also confirm that the initial two elements are present in the DOM?

test('conditional rendering shows and hides content based on state', () => {
  const loggedIn = new State(false);

  append(document.body, (
    <div id="app">
      {dv(loggedIn, v => v
        ? <p id="dashboard">Welcome back!</p>
        : <p id="login">Please log in</p>
      )}
    </div>
  ));

  expect(document.getElementById('login')).not.toBeNull();
  expect(document.getElementById('dashboard')).toBeNull();

  loggedIn.set(true);

  expect(document.getElementById('login')).toBeNull();
  expect(document.getElementById('dashboard')).not.toBeNull();
  expect(document.getElementById('dashboard').textContent).toBe('Welcome back!');
});
// why only check the textContent for one state and not the other?

test('updating a state object partially preserves untouched properties', () => {
  const user = new State({ name: 'alice', role: 'admin', score: 10 });

  append(document.body, (
    <p id="out">{dv(user, u => `${u.name} (${u.role}) - ${u.score}`)}</p>
  ));

  expect(document.getElementById('out').textContent).toBe('alice (admin) - 10');

  user.update({ score: 99 });

  expect(document.getElementById('out').textContent).toBe('alice (admin) - 99');
});

test('two independent states do not interfere with each other', () => {
  const a = new State('foo');
  const b = new State('bar');

  append(document.body, (
    <>
      <p id="a">{a}</p>
      <p id="b">{b}</p>
    </>
  ));

  a.set('changed');

  expect(document.getElementById('a').textContent).toBe('changed');
  expect(document.getElementById('b').textContent).toBe('bar');
});
