```
for (var i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i)
  }, (function (i) {
      var b = i * 1000;
      console.log(b)
    })(i))
}
```
输出0, 1000, 2000,三次3,为何不是0,3,1000,3,2000,3?
数组会把每一次 转toString()   恰恰数组的toString()是这样的   Array.prototype.toString = function(){
 return this.join();
}
```
方法一
function flattern(arr) {
    return arr.join(',').split(',');
}

方法二
flattern.toString().replace(/{|}|[|]/g, ‘’).split(‘,’)


```




1、二叉树算法
2、Promise async 等


1、沙箱环境 ast 也是可以实现 new Function es6 proxy with
2、event loop
3、symbol 保证对象变量的唯一性 obj2.text = Symbol('sdf');obj[obj2.text] = 3
4、脏检查，存取器技术 这是数据绑定两种技术 优劣
