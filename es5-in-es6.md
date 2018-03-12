## IIFE(immediately-invoked-function-expression) 立即自执行函数

查看[这里](http://benalman.com/news/2010/11/immediately-invoked-function-expression/)。

```
// es5
(function (win, doc) {
    console.log('title:', doc.title);
})(window, document);

// es6
((global, doc)  => {
  console.log('title:', doc.title);
})(window, document)
// or
{
    const global = window;
    const doc = document;
    console.log('title:', document.title);
}
```
