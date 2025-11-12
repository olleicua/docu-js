import '../src/docu.js';

const dv = window.docu.dynamicValue;

test('creates basic DOM element', () => {
  window.docu.append(document.body, <div className="test">Hello World!</div>);
  
  expect(document.querySelector('.test').textContent).toBe('Hello World!');
});

test('handles click events', () => {
  let clicked = false;
  window.docu.append(
    document.body,
    <button onClick={() => clicked = true}>Click me</button>
  );

  document.querySelector('button').click();
  
  expect(clicked).toBe(true);
});

test('handles input events', () => {
  const numberOfCats = new docu.State(0);
  window.docu.append(
    document.body,
    (
      <div>
	<input
	  type="number"
	  value={dv(numberOfCats)}
	  onChange={(event) => numberOfCats.set(event.target.value)}
	/>
	<p className="cats">
	  {dv(numberOfCats, (n) => '🐈'.repeat(n))}
	</p>
      </div>
    )
  );

  const input = document.querySelector('input');
  const paragraph = document.querySelector('.cats');

  console.log(document.body.innerHTML);

  expect(paragraph.textContent.match(/🐈/g)).toBe(null);
  input.value = 5;
  input.dispatchEvent(new Event('change', { bubbles: true }));
  expect(paragraph.textContent.match(/🐈/g).length).toBe(5);
});
