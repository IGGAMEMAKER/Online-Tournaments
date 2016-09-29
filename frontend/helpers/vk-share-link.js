export default function (url, title, description, image) {
  const shareParameters = `url=${url}&title=${title}&description=${description}&image=${image}&noparse=true`;
  return `http://vk.com/share.php?${shareParameters}`;
};
