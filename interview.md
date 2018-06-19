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
6、路由 parallel routing
7、pwa 的 data shell 和 app shell

8、并行路由器
9、实现 es6 类



plain Javascript objects 翻译成啥？


1、请简单地说出数据绑定的方法，并实现至少一种数据绑定方法

简述组件化方案 react, vue, Polymer

Getter/setter properties are neither supported since accessors can't be wrapped by accessors again
怎么翻译？

查看下 vue



自己创建一个框架 ?开撸

## 存储器技术

Expando properties 是弱点无法监听动态添加的属性。添加后手动添加 observe 或者 es6 proxy
封装对象实现注册变化


## 请描述一下 webpack 的 HMR

实现原理，为什么修改 js 会刷新页面而只有修改 scss 并不会呢？



现在是否需要迁移到HTTP/2
终止HTTP/2和TLS
考虑从SPDY开始
找出为HTTP/1.x优化的代码
部署HTTP/2或SPDY
再谈HTTP/1.x优化
实现智能分域


FOUC 指的是什么？

直接单独给seo吐数据 就行 seo的ua固定