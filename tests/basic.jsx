import '../src/docu.js';

const { append } = window.docu;

test('creates basic DOM element', () => {
  append(document.body, <div className="test">Hello World!</div>);

  expect(document.querySelector('.test').textContent).toBe('Hello World!');
});

test('creates DOM elements using a function', () => {
  const Hello = ({ color, name }) => {
    return (
      <p style={{ color }}>
        Hello {name}!
      </p>
    );
  };

  append(document.body, <Hello color="green" name="Eliza" />);

  expect(document.querySelector('p').style.color).toBe('green');
  expect(document.querySelector('p').textContent).toBe('Hello Eliza!');
});

test('numbers become text nodes', () => {
  append(
    document.body,
    <p>
      {1 + 1}
      {17 / 2}
      {2 / 3}
      {Math.pow(10,234)}
    </p>
  );

  const nodes = document.querySelector('p').childNodes;
  expect(nodes[0] instanceof Text).toBe(true);
  expect(nodes[0].textContent).toBe('2');
  expect(nodes[1] instanceof Text).toBe(true);
  expect(nodes[1].textContent).toBe('8.5');
  expect(nodes[2] instanceof Text).toBe(true);
  expect(nodes[2].textContent).toMatch(/^0.666/);
  expect(nodes[3] instanceof Text).toBe(true);
  expect(nodes[3].textContent).toBe('1e+234');
  expect(document.body.textContent).toMatch(/28\.50\.666+1e\+234/);
});

test('handles click events', () => {
  let clicked = false;
  append(
    document.body,
    <button onClick={() => clicked = true}>Click me</button>
  );

  document.querySelector('button').click();

  expect(clicked).toBe(true);
});
