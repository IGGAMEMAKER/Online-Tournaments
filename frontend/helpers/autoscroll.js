function hashLinkScroll() {
  // // window.scrollTo(0,0);
  // const { hash } = window.location;
  // console.log('hashLinkScroll', hash);
  // if (hash !== '') {
  //   // Push onto callback queue so it runs after the DOM is updated,
  //   // this is required when navigating from a different page so that
  //   // the element is rendered on the page before trying to getElementById.
  //   setTimeout(() => {
  //     const id = hash.replace('#', '');
  //     const element = document.getElementById(id);
  //     if (element) element.scrollIntoView();
  //
  //     // window.onscroll =
  //   }, 0);
  // }
}

module.exports = {
  autoscroll: hashLinkScroll
};
