import '../src/docu.js';

const { append, State, dynamicValue: dv } = window.docu;

test('n cats', () => {
  const numberOfCats = new docu.State(0);
  append(document.body, (
    <>
      <input
	type="number"
	value={dv(numberOfCats)}
	onChange={(event) => numberOfCats.set(event.target.value)}
      />
      <p className="cats">
	{dv(numberOfCats, (n) => '🐈'.repeat(n))}
      </p>
    </>
  ));

  const input = document.querySelector('input');
  const paragraph = document.querySelector('.cats');

  expect(paragraph.textContent.match(/🐈/g)).toBe(null);

  input.value = 5;
  input.dispatchEvent(new Event('change', { bubbles: true }));

  expect(paragraph.textContent.match(/🐈/g).length).toBe(5);
});

test('content swap', () => {
  const contentOption = new State('paragraph');

  const dropdown = (
    <label>
      type of content:
      <select onChange={(event) => contentOption.set(event.target.value)}>
	<option
	  value="paragraph"
	  selected={dv(contentOption, v => v === 'paragraph')}
	>
          Paragraph
	</option>
	<option
	  value="image"
	  selected={dv(contentOption, v => v === 'image')}
	>
          Image
	</option>
      </select>
    </label>
  );
  append(document.body, dropdown);
  const select = dropdown.querySelector('select');

  const content = (
    <p
      style={{
        border: '3px dashed #417',
        padding: '5px'
      }}
    >
      content:
      {
	dv(contentOption, (option) => {
          return {
            paragraph: <p>the cat is adorable</p>,
            image: <img src="139.jpg" />
          }[option];
        })
      }
      <br />
    </p>
  );
  append(document.body, content);

  expect(content.textContent).toMatch(/the cat is adorable/);
  expect(content.querySelector('img')).toBe(null);

  select.value = 'image';
  select.dispatchEvent(new Event('change', { bubbles: true }));

  expect(content.textContent).not.toMatch(/the cat is adorable/);
  expect(content.querySelector('img')).not.toBe(null);
  expect(content.querySelector('img').src).toMatch('139.jpg');

  select.value = 'paragraph';
  select.dispatchEvent(new Event('change', { bubbles: true }));

  expect(content.textContent).toMatch(/the cat is adorable/);
  expect(content.querySelector('img')).toBe(null);
});
