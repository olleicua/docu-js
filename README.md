script tags allow you to put JavaScript in HTML. JSX allows you to put HTML in JavaScript. Both are things you might want to do in different situations and you should be able to without having to add in all the complexity that comes with React that you probably dont need most of the time. That's what docu.js is for.

# docu

docu is a library to streamline the creation and management of dynamic html documents. its goal is to provide a simple and light-weight interface to the document object model that provides event-base state management with an easy to use api that gets out of your way and stays out of your way.

## on the state of this documentation

I plan to improve this documentation a bunch as the project develops. Right now its very much in proof of concept mode.

### Build

Build uses rollup for the library itself and babel for compiling JSX to JS.

- `npm test` runs the test suite
- `npm run build` compliles the library itself using rollup
- `npm run build:demo:old` uses babel to compile the demo from JSX to JS
- `npm run build:all` runs build and build demo

## usage examples

What follows is are some basic examples of what the library is capable of. More detailed examples are in the demo folder.

### generating static html:

JS:
```js
const container = new docu.Entity({
  className: 'main-content',
  children: [
    new docu.Entity('p', {
      textContent: 'paragraph 1'
    }),
    new docu.Entity('p', {
      textContent: 'paragraph 2',
      style: { textDecoration: 'underline' }
    })
  ]
});
docu.append(document.body, container);
```

JSX:
```jsx
const container = (
  <div className="main-content">
    <p>paragraph 1</p>
    <p style={{ textDecoration: 'underline' }}>paragraph 2</p>
  </div>
);
docu.append(document.body, container);
```

the above will add the following html to the bottom of your webpage:

```html
<div class="main-content">
  <p>paragraph 1</p>
  <p style="text-decoration: underline;">
</div>
```

note that the first call to `docu.Entity` didn't need to specify an html tag name because the default is 'div'.

you can later modify the properties on an entity like so:

```js
container.update({
  style: {
    background: 'green'
  }
});
```

### simple event listeners

```js
const clicker = new docu.Listener();

docu.append(
  document.body,
  new docu.Entity('button', {
    textContent: 'click me',
    onClick: (event) => clicker.send(event)
  })
);

clicker.listen((event) => {
  console.log('the clicker recieved an event:', event);
});
```

the above will create a button that, when clicked, logs the click event to the console.

### event-based dynamic state management

JS:
```js
const name = new docu.State('world');

const input = new docu.Entity('label', {
  children: [
    'name: ',
    new docu.Entity('input', {
      value: name.dynamicValue(),
      onKeyUp: (event) => name.set(event.target.value)
    })
  ]
});
docu.append(document.body, input);

const content = new docu.Entity('p', {
  children: [
    'hello ',
    new docu.Entity('span', {
      textContent: name.dynamicValue()
    })
  ]
});
docu.append(document.body, content);
```

JSX:
```js
const name = new docu.State('world');

const input = (
  <label>
    name:
    <input
      value={name.dynamicValue()}
      onKeyUp={(event) => name.set(event.target.value)}
    />
  </label>
);
docu.append(document.body, input);

const content = (
  <p>
    hello
    <span>{name.dynamicValue()}</span>
  </p>
);
docu.append(document.body, content);
```

the above will generate an input and a paragraph linked by a state listener. whenever the user enters text in the input field, the paragraph's content will automatically be updated with the new value.
