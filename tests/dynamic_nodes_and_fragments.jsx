import { range } from 'lodash-es';

import '../src/docu.js';

const { append, State, dynamicValue: dv } = window.docu;

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

test('DynamicNode keeps position', () => {
  const newLineCount = new State(1);
  const showFrags = new State(false);

  const newLines = dv(newLineCount, (count) => {
    if (count < 1) return <></>;

    if (count === 1) return <br />;

    return range(count).map(() => <br />);
  });

  const frag1 = <>{newLines}</>;
  const frag2 = <>{newLines}<p>foo</p>bar</>;
  const frag3 = <><p>foo</p>{newLines}bar</>;
  const frag4 = <><p>foo</p>bar{newLines}</>;

  const fragsDiv = <div className="frags">1{frag1}2{frag2}3{frag3}4{frag4}5</div>;

  append(
    document.body,
    <>
      <div className="only">{newLines}</div>
      <div className="first">{newLines}<p>abc</p>def</div>
      <div className="middle">xyz{newLines}<span>zyx</span></div>
      <div className="last">foobar<i>icon</i>{newLines}</div>
      {dv(showFrags, (show) => show ? fragsDiv : '')}
    </>
  );

  expect(document.querySelector('.only').innerHTML).toBe('<br>');
  expect(document.querySelector('.first').innerHTML).toBe('<br><p>abc</p>def');
  expect(document.querySelector('.middle').innerHTML).toBe('xyz<br><span>zyx</span>');
  expect(document.querySelector('.last').innerHTML).toBe('foobar<i>icon</i><br>');
  expect(document.querySelector('.frags')).toBe(null);

  showFrags.set(true)

  expect(document.querySelector('.frags').innerHTML).toBe(
    '1<br>2<br><p>foo</p>bar3<p>foo</p><br>bar4<p>foo</p>bar<br>5'
  );

  newLineCount.set(0);

  expect(document.querySelector('.only').innerHTML).toBe('');
  expect(document.querySelector('.first').innerHTML).toBe('<p>abc</p>def');
  expect(document.querySelector('.middle').innerHTML).toBe('xyz<span>zyx</span>');
  expect(document.querySelector('.last').innerHTML).toBe('foobar<i>icon</i>');
  expect(document.querySelector('.frags').innerHTML).toBe(
    '12<p>foo</p>bar3<p>foo</p>bar4<p>foo</p>bar5'
  );

  newLineCount.set(3);

  expect(document.querySelector('.only').innerHTML).toBe('<br><br><br>');
  expect(document.querySelector('.first').innerHTML).toBe('<br><br><br><p>abc</p>def');
  expect(document.querySelector('.middle').innerHTML).toBe('xyz<br><br><br><span>zyx</span>');
  expect(document.querySelector('.last').innerHTML).toBe('foobar<i>icon</i><br><br><br>');
  expect(document.querySelector('.frags').innerHTML).toBe(
    '1<br><br><br>2<br><br><br><p>foo</p>bar3<p>foo</p><br><br><br>bar4<p>foo</p>bar<br><br><br>5'
  );

  document.querySelector('span').setAttribute('data-foo', 17);

  expect(document.querySelector('.middle').innerHTML).toBe('xyz<br><br><br><span data-foo="17">zyx</span>');

  newLineCount.set(0);

  expect(document.querySelector('.only').innerHTML).toBe('');
  expect(document.querySelector('.first').innerHTML).toBe('<p>abc</p>def');
  expect(document.querySelector('.middle').innerHTML).toBe('xyz<span data-foo="17">zyx</span>');
  expect(document.querySelector('.last').innerHTML).toBe('foobar<i>icon</i>');
  expect(document.querySelector('.frags').innerHTML).toBe(
    '12<p>foo</p>bar3<p>foo</p>bar4<p>foo</p>bar5'
  );

  newLineCount.set(1);

  expect(document.querySelector('.only').innerHTML).toBe('<br>');
  expect(document.querySelector('.first').innerHTML).toBe('<br><p>abc</p>def');
  expect(document.querySelector('.middle').innerHTML).toBe('xyz<br><span data-foo="17">zyx</span>');
  expect(document.querySelector('.last').innerHTML).toBe('foobar<i>icon</i><br>');
  expect(document.querySelector('.frags').innerHTML).toBe(
    '1<br>2<br><p>foo</p>bar3<p>foo</p><br>bar4<p>foo</p>bar<br>5'
  );
});

test('replacing with nested empty fragments', () => {
  const data = new State({ a: 1, b: 2 });
  const verbose = new State(false);

  append(document.body, dv(
    data,
    ({a, b}) => {
      return (
        <>
          <p>a: {a}</p>
          <p>b: {b}</p>
          {dv(
            verbose,
            (showExtras) => {
              if (!showExtras) return <></>;

              return <div className="extras">so many details</div>;
            }
          )}
        </>
      );
    }
  ));

  expect(document.body.textContent).toMatch(/a: 1/);
  expect(document.body.textContent).toMatch(/b: 2/);
  expect(document.body.querySelector('.extras')).toBe(null);

  verbose.set(true)

  expect(document.body.querySelector('.extras')).not.toBe(null);

  verbose.set(false)

  expect(document.body.querySelector('.extras')).toBe(null);

  data.update({ b: 3 });

  expect(document.body.textContent).toMatch(/a: 1/);
  expect(document.body.textContent).toMatch(/b: 3/);
  expect(document.body.querySelector('.extras')).toBe(null);

  verbose.set(true)

  expect(document.body.querySelector('.extras')).not.toBe(null);

  verbose.set(false)

  expect(document.body.querySelector('.extras')).toBe(null);
});
