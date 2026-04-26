import '../src/docu.js';

const { append, State } = window.docu;

test('DynamicNode updates the fragment it is in', () => {
  const content = new State(<b>foo</b>);

  const frag = <>x: {content} ... y</>;

  expect(frag.children.length).toBe(3);
  expect(frag.children.map(x => x.constructor.name)).toEqual(['Text', 'HTMLElement', 'Text']);
  expect(frag.children[1].tagName).toBe('B');
  expect(frag.children[0].textContent).toBe('x: ');
  expect(frag.children[1].textContent).toBe('foo');
  expect(frag.children[2].textContent).toBe(' ... y');

  content.set(<span>bar</span>);

  expect(frag.children[1].tagName).toBe('SPAN');
  expect(frag.children[1].textContent).toBe('bar');

  content.set(<><b>baz</b>qux<span>z</span></>);

  expect(frag.children.length).toBe(5);
  expect(frag.children[1].tagName).toBe('B');
  expect(frag.children[3].tagName).toBe('SPAN');
  expect(frag.children[0].textContent).toBe('x: ');
  expect(frag.children[1].textContent).toBe('baz');
  expect(frag.children[2].textContent).toBe('qux');
  expect(frag.children[3].textContent).toBe('z');
  expect(frag.children[4].textContent).toBe(' ... y');

  content.set(
    <>
      <>
	<span>a</span>
	<span>b</span>
	<span>c</span>
      </>
      dd
      <>
	<span>e</span>
	<span>f</span>
      </>
    </>
  );

  expect(frag.children.length).toBe(8);
  expect(frag.children[1].tagName).toBe('SPAN');
  expect(frag.children[2].tagName).toBe('SPAN');
  expect(frag.children[3].tagName).toBe('SPAN');
  expect(frag.children[5].tagName).toBe('SPAN');
  expect(frag.children[6].tagName).toBe('SPAN');
  expect(frag.children[0].textContent).toBe('x: ');
  expect(frag.children[1].textContent).toBe('a');
  expect(frag.children[2].textContent).toBe('b');
  expect(frag.children[3].textContent).toBe('c');
  expect(frag.children[4].textContent).toBe('dd');
  expect(frag.children[5].textContent).toBe('e');
  expect(frag.children[6].textContent).toBe('f');
  expect(frag.children[7].textContent).toBe(' ... y');

  content.set('xyz');

  expect(frag.children.length).toBe(3);
  expect(frag.children.map(x => x.constructor.name)).toEqual(['Text', 'Text', 'Text']);
  expect(frag.children[0].textContent).toBe('x: ');
  expect(frag.children[1].textContent).toBe('xyz');
  expect(frag.children[2].textContent).toBe(' ... y');
});


test('adding a fragment to a fragment', () => {
  const frag = (
    <>
      <b>foo</b>
      bar
    </>
  );

  append(document.body, frag);

  expect(document.body.innerHTML).toBe('<b>foo</b>bar');

  frag.appendChild(<b>baz</b>);

  expect(document.body.innerHTML).toBe('<b>foo</b>bar<b>baz</b>');

  frag.appendChild(
    <>
      <span>a</span>
      <span>b</span>
    </>
  );

  expect(document.body.innerHTML).toBe('<b>foo</b>bar<b>baz</b><span>a</span><span>b</span>');
});
