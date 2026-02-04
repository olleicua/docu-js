const dv = docu.dynamicValue;
const State = docu.State;

const Demo = {};

const pages = [
  {
    name: 'Hello World',
    slug: 'hello',
  },
  {
    name: "N Cats",
    slug: 'n_cats',
  },
];

const initialHash = location.hash.replace(/^#/, '');
const initialPage = pages.find(p => p.slug === initialHash) || pages[0];
const activePage = new State(initialPage);

activePage.listener.listen(p => location.hash = p.slug)

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
  const name = new State('Sam');
  const element = (
    <div>
      <p style={{ color: 'purple' }}>Hello {name}</p>
      <input onChange={(e) => name.set(e.target.value)} type="text" />
    </div>
  );

  element.style.textDecoration = 'underline';

  return element;
}
