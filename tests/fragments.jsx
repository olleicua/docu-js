import '../src/docu.js';

const { append } = window.docu;

test('creates basic fragment with two DOM elements', () => {
  append(document.body, (
    <>
      <p>lorem</p>
      <p>ipsum</p>
    </>
  ));

  const paragraphs = document.querySelectorAll('p');
  expect(paragraphs.length).toBe(2);
  expect(paragraphs[0].textContent).toBe('lorem');
  expect(paragraphs[1].textContent).toBe('ipsum');
});

test('fragments, entities, and strings can be appended to an entity', () => {
  const box = <div className="box">foo</div>;
  append(document.body, box);

  expect(document.querySelector('.box').innerHTML).toBe('foo');

  append(box, (
    <>
      <p>abc</p>
      <p>def</p>
    </>
  ));

  expect(document.querySelector('.box').innerHTML).toBe('foo<p>abc</p><p>def</p>');

  append(box, <p>ghi</p>);

  expect(document.querySelector('.box').innerHTML).toBe('foo<p>abc</p><p>def</p><p>ghi</p>');

  append(box, 'jkl');

  expect(document.querySelector('.box').innerHTML).toBe('foo<p>abc</p><p>def</p><p>ghi</p>jkl');
});

test('fragments, entities, and strings can be appended to a fragment', () => {
  const fragment = (
    <>
      <span style={{ fontWeight: 'bold' }}>this</span>
      is a
      <span style={{ textDecoration: 'underline' }}>fragment</span>
    </>
  );
  append(document.body, <div className="box">{fragment}</div>);

  expect(document.querySelector('.box').innerHTML).toBe(
    '<span style=\"font-weight: bold;\">this</span>is a' +
      '<span style=\"text-decoration: underline;\">fragment</span>'
  );

  const subFragment = (
    <>
      <p>abc</p>
      <p>def</p>
    </>
  );
  append(fragment, subFragment);

  expect(document.querySelector('.box').innerHTML).toBe(
    '<span style=\"font-weight: bold;\">this</span>is a' +
      '<span style=\"text-decoration: underline;\">fragment</span>' +
      '<p>abc</p><p>def</p>'
  );

  append(fragment, <p>ghi</p>);

  expect(document.querySelector('.box').innerHTML).toBe(
    '<span style=\"font-weight: bold;\">this</span>is a' +
      '<span style=\"text-decoration: underline;\">fragment</span>' +
      '<p>abc</p><p>def</p>' +
      '<p>ghi</p>'
  );
  append(subFragment, 'xyzzy');

  expect(document.querySelector('.box').innerHTML).toBe(
    '<span style=\"font-weight: bold;\">this</span>is a' +
      '<span style=\"text-decoration: underline;\">fragment</span>' +
      '<p>abc</p><p>def</p>' +
      'xyzzy' +
      '<p>ghi</p>'
  );

  subFragment.remove();

  expect(document.querySelector('.box').innerHTML).toBe(
    '<span style=\"font-weight: bold;\">this</span>is a' +
      '<span style=\"text-decoration: underline;\">fragment</span>' +
      '<p>ghi</p>'
  );
});
