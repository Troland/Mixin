// 输出对象类型
function detectType(obj) {​
  return Object.prototype.toString.call(obj).slice(8, -1);
}
