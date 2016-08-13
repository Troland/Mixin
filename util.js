// 数字填补
function padding(number) {
  return number < 10 ? '0' + number : '' + number;
}

// 类型判断
function type(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
}

// 获取对象的构造函数名称
function getConstructorName(obj) {
  return obj && obj.constructor && obj.constructor.toString().match(/function\s*([^(]*)/)[1];
}

// 获取参数列表
var args = Array.prototype.slice.apply(arguments);

// 原型继承
var clone = (function () {
  var F = function () {};
  return function (proto) {
    F.prototype = proto;
    return new F();
  }
})();

// 获取子节点兼容低版本的IE
function getElementChildren(node) {

}

// 获取指定id元素
function $(id) {
  return document.getElementById(id);
}

// 获取元素的样式
function getStyle(element, cssPropertyName) {
  var el = document.getElementById(element);

  // if getComputedStyle is supported, ie8 and below is not supported
  if (window.getComputedStyle) {
    return window.getComputedStyle(el)[cssPropertyName];
  } else {
    // http://www.quirksmode.org/dom/getstyles.html ie should use lineHeight instead
    var cssPropertyNameArr, cssCamelCaseName;
    cssPropertyNameArr = cssPropertyName.split('-');
    if (cssPropertyNameArr.length > 1) {
      cssCamelCaseName = cssPropertyNameArr[0] + cssPropertyNameArr[1][0].toUpperCase() + cssPropertyNameArr[1].slice(1);
    } else {
      cssCamelCaseName = cssPropertyName;
    }

    return el.currentStyle[cssCamelCaseName];
  }
}

// 获取元素下的具有指定类名的元素


// 设置元素的内容firefox不支持innerText

// 兼容element.dataset
