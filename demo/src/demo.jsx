const dv = docu.dynamicValue;
const State = docu.State;

const Demo = {};

// TODO: we will need to fetch source code from the src directory and compiled versions from the dist directory so we probably want the "file" property here to be something more generic like slug (which could be used for hashtag navigation)
const pages = [
  {
    name: 'Hello World',
    file: 'hello.jsx',
  },
  {
    name: "N Cats",
    file: 'n_cats.jsx',
  },
];

// TODO: use hashtags in URL for navigation
const activePage = new State(pages[0]);

function MenuItem({ page }) {
  const klass = dv(
    activePage,
    (p) => page === p ? 'menu-item active' : 'menu-item'
  );

  return (
    <a
      className={klass}
      href="javascript:void(0);"
      onClick={() => activePage.set(page)}
    >
      {page.name}
    </a>
  );
}

Demo.menu = () => {
  return (
    <div className="menu">
      { pages.map((page) => <MenuItem page={page} />) }
    </div>
  );
};

Demo.page = () => {
  // TODO: This should check to see if the page object has its "loaded" property set and if not it will need to fetch the source code from src and create script tags pointing to compiled code in dist. Also we may want multiple examples per page so thats an aspect of this to think about..
  return 'bar';
}
