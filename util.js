export function getImgResolution(url, callback) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      resolve(image);
    };

    image.onerror = (e) => {
      reject(new Error('图片不能被加载'));
    };

    image.src = url;
  }).then((image) => {
    return { width: image.width, height: image.height };
  }).then((size) => {
    return callback(size);
  }).catch((error) => {
    callback(error);
  });
}
