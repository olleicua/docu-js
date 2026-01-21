import '../src/docu.js';

const { append } = window.docu;

test('append works with a NodeList', () => {
  const $box1 = (
    <div id="box1">
      foo
      <span>bar</span>
      baz
      <span>qux</span>
    </div>
  );
  const $box2 = <div id="box2"></div>;
  append(document.body, [$box1, $box2]);

  expect(document.getElementById('box1').innerHTML).toBe('foo<span>bar</span>baz<span>qux</span>')
  expect(document.getElementById('box2').innerHTML).toBe('')

  append($box2, $box1.childNodes);

  expect(document.getElementById('box1').innerHTML).toBe('')
  expect(document.getElementById('box2').innerHTML).toBe('foo<span>bar</span>baz<span>qux</span>')
});

test('append works with an HTMLCollection', () => {
  const $box1 = (
    <div id="box1">
      foo
      <span>bar</span>
      baz
      <span>qux</span>
    </div>
  );
  const $box2 = <div id="box2"></div>;
  append(document.body, [$box1, $box2]);

  expect(document.getElementById('box1').innerHTML).toBe('foo<span>bar</span>baz<span>qux</span>')
  expect(document.getElementById('box2').innerHTML).toBe('')

  append($box2, $box1.children);

  expect(document.getElementById('box1').innerHTML).toBe('foobaz')
  expect(document.getElementById('box2').innerHTML).toBe('<span>bar</span><span>qux</span>')
});
