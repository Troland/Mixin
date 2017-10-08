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
