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

test('handles click events', () => {
  let clicked = false;
  append(
    document.body,
    <button onClick={() => clicked = true}>Click me</button>
  );

  document.querySelector('button').click();

  expect(clicked).toBe(true);
});
