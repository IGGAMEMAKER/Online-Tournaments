export default function (id) {
  const node = document.getElementById(id);
  node.select();
  document.execCommand('copy');
  node.blur();
}
