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
4、脏检查，存取器技术 这是数据绑定两种技术 优劣 脏检查会一直查数据变化，存取器不会，但存取器不能处理 expando 动态添加的属，而脏检查却可以。性能脏检查会一直检查，而存取器技术可以是把操作缓存起来再批量执行。可以参见 vue.nextTick 的语法，
5、es6 代理数据绑定 Reflect, proxy, WeakMap, map
