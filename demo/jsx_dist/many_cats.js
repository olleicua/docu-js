const dv = docu.dynamicValue;
const numberOfCats = new docu.State(0);
const input = docu.jsxEntity("label", null, "number of cats:", docu.jsxEntity("input", {
  value: dv(numberOfCats),
  type: "number",
  onChange: event => numberOfCats.set(event.target.value)
}));
docu.append(document.querySelector('.many-cats'), input);
const content = docu.jsxEntity("p", {
  style: {
    backgroundColor: '#417'
  }
}, dv(numberOfCats, n => '🐈'.repeat(n)));
docu.append(document.querySelector('.many-cats'), content);