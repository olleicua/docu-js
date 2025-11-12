import '../src/docu.js';

test('creates basic DOM element', () => {
  const element = <div className="test">Hello World</div>;
  window.docu.append(document.body, element);
  
  expect(document.querySelector('.test').textContent).toBe('Hello World');
});

test('handles click events', () => {
  let clicked = false;
  const button = <button onClick={() => clicked = true}>Click me</button>;
  
  window.docu.append(document.body, button);
  button.$el.click();
  
  expect(clicked).toBe(true);
});
