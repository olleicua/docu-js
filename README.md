# docu

docu is a library for stramline the creation and management of dynamic html documents. its goal is to provid a simple and light-weight interface to the document object model that provides event-base state management with an easy to use api that gets out of your way and stays out of your way.

## usage examples

### generating static html:

```
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
docu.append(container);
```

the above will add the following html to the bottom of your webpage:

```
<div class="main-content">
  <p>paragraph 1</p>
	<p style="text-decoration: underline;">
</div>
```

note that the first call to `docu.Entity` didn't need to specify an html tag name because the default is 'div'.

you can later modify the properties on an entity like so:

```
container.update({
	style: {
    background: 'green'
  }
});
```

### simple event listeners

```
const clicker = new docu.Listener();

docu.append(new docu.Entity('button', {
	onClick: (event) => clicker.send(event)
}));

clicker.listen((event) => {
  console.log('the clicker recieved an event:', event);
});
```

the above will create a button that, when clicked, logs the click event to the console.

### event-based dynamic state management

```
const name = new docu.State('world');

const input = new docu.Entity('label', {
	children: [
	  'name: ',
	  new docu.Entity('input', {
		  value: name,
			onKeyUp: (event) => name.send(event.target.value)
		})
  ]
});
docu.append(input);

const content = new docu.Entity('p', {
	children: [
	  'hello ',
	  new docu.Entity('span', {
		  textContent: name
		})
  ]
});
docu.append(content);
```

the above will generate an input and a paragraph linked by a state listener. whenever the user enters text in the input field, the paragraph's content will automatically be updated with the new value.