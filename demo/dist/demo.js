const dv = docu.dynamicValue;
const State = docu.State;
const Demo = {};
const pages = [{
  name: 'Hello World',
  slug: 'hello'
}, {
  name: "N Cats",
  slug: 'n_cats'
}];
const initialHash = location.hash.replace(/^#/, '');
const initialPage = pages.find(p => p.slug === initialHash) || pages[0];
const activePage = new State(initialPage);
activePage.listener.listen(p => location.hash = p.slug);
function MenuItem({
  page
}) {
  const klass = dv(activePage, p => page === p ? 'menu-item active' : 'menu-item');
  return docu.jsxEntity("a", {
    className: klass,
    href: "javascript:void(0);",
    onClick: () => activePage.set(page)
  }, page.name);
}
Demo.menu = () => {
  return docu.jsxEntity("div", {
    className: "menu"
  }, pages.map(page => docu.jsxEntity(MenuItem, {
    page: page
  })));
};
Demo.page = () => {
  // TODO: This should check to see if the page object has its "loaded" property set and if not it will need to fetch the source code from src and create script tags pointing to compiled code in dist. Also we may want multiple examples per page so thats an aspect of this to think about..
  return 'bar';
};