const dv = docu.dynamicValue;
const State = docu.State;

const Demo = {};

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
    (p) => page === p ? 'active' : ''
  );

  return (
    <a
      className={klass}
      href="javascript:void(0);"
      onClick={activePage.set(page)}
    >
      {page.name}
    </a>
  );
}

Demo.menu = () => {
  return (
    <div className="menu">
      {	pages.map((page) => MenuItem({ page })) }
    </div>
  );
};

Demo.page = () => {
  return 'bar';
}
