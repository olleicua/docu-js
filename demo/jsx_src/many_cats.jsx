const numberOfCats = new docu.State(0);

const input = (
  <label>
    number of cats:
    <input
      value={numberOfCats.dynamicValue()}
      type="number"
      onChange={(event) => numberOfCats.set(event.target.value)}
    />
  </label>
);

docu.append(document.querySelector('.many-cats'), input);

const content = (
  <p style={{ backgroundColor: '#417' }}>
    {numberOfCats.dynamicValue((n) => '🐈'.repeat(n))}
  </p>
);

docu.append(document.querySelector('.many-cats'), content);
