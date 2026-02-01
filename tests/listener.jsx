import '../src/docu.js';

const { Listener } = window.docu;

test('listener works', () => {
  const bell = new Listener();

  let bellRang = false;
  bell.listen(() => {
    bellRang = true;
  });
  let ringCounter = 0;
  bell.listen(() => {
    ringCounter ++;
  });

  expect(bellRang).toBe(false);
  expect(ringCounter).toBe(0);

  bell.send();

  expect(bellRang).toBe(true);
  expect(ringCounter).toBe(1);

  bell.send();

  expect(bellRang).toBe(true);
  expect(ringCounter).toBe(2);
});

test('listener with multiple arguments', () => {
  const therapist = new Listener();

  let notes = '';
  therapist.listen((...things) => {
    notes += 'It sounds like ';
    notes += things.join(' and ').replaceAll(/\bI\b/g, 'you');
    notes += '\n';
  });

  therapist.send(
    'I have so many emotions',
    'everything is IMPOSSIBLE',
  );

  expect(notes).toBe('It sounds like you have so many emotions and everything is IMPOSSIBLE\n');
});
