关于那个ArrayBuffer()
DataView的查看一下那个文件下载的
Worker, SharedArrayBuffer,socket



module.exports输出的对象如果被外面引用，是会缓存的。
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {   get counter() {     return counter   },   incCounter: incCounter, };
这样值改动才可以得到改动的值
es6不会但是如果node写成es6的格式呢？这就会有些奇怪了,试验下吧。
// lib.js
export let counter = 3;
export function incCounter() {
  counter++;
}

// main.js
import { counter, incCounter } from './lib';
console.log(counter); // 3
incCounter();
console.log(counter); // 4





//这个不明白
let mm = function (superclass) {
  return class extends superclass {
    foo() {
      console.log('foo from mixin')
    }
  }
}

export default 后面加一个对象？不是很明白为什么vue的可以这样处理？特有的吗？这样的话在import的时候就不用{}来引用直接import Header等
export default {
  data () {

  },

}
function createWebService(baseUrl) {
  return new Proxy({}, {
    get(target, propKey, receiver) {
      return () => httpGet(baseUrl+'/' + propKey);
    }
  });
}

Proxy实现数据库的ORM层?


尾递归，尾调用
这里的pipeline不明白
const pipeline = (...funcs) =>
  val => funcs.reduce((a, b) => b(a), val);

const plus1 = a => a + 1;
const mult2 = a => a * 2;
const addThenMult = pipeline(plus1, mult2);

addThenMult(5)
// 12

m2({}) // [undefined, undefined]不明白,m2函数的参数默认值难道不是那个0吗？
// 写法一
function m1({x = 0, y = 0} = {}) {
  return [x, y];
}

// 写法二
function m2({x, y} = { x: 0, y: 0 }) {
  return [x, y];
}

// 函数没有参数的情况
m1() // [0, 0]
m2() // [0, 0]

// x和y都有值的情况
m1({x: 3, y: 8}) // [3, 8]
m2({x: 3, y: 8}) // [3, 8]

// x有值，y无值的情况
m1({x: 3}) // [3, 0]
m2({x: 3}) // [3, undefined]

// x和y都无值的情况
m1({}) // [0, 0];
m2({}) // [undefined, undefined]

m1({z: 3}) // [0, 0]
m2({z: 3}) // [undefined, undefined]

**看不懂**
function tco(f) {
  var value;
  var active = false;
  var accumulated = [];

  return function accumulator() {
    accumulated.push(arguments);
    if (!active) {
      active = true;
      while (accumulated.length) {
        value = f.apply(this, accumulated.shift());
      }
      active = false;
      return value;
    }
  };
}

var sum = tco(function(x, y) {
  if (y > 0) {
    return sum(x + 1, y - 1)
  }
  else {
    return x
  }
});

sum(1, 100000)
// 100001

// 双重解构赋值？
var o = Object.create({ x: 1, y: 2 });
o.z = 3;

let { x, ...{ y, z } } = o;
x // 1
y // undefined
z // 3
