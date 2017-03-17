document.addEventListener("DOMContentLoaded", function() {
  if ("indexedDB" in window) {
    console.log("Yes supported indexedDb");
  } else {
    console.log("No supported indexedDb");
  }
}, false);

// 阶乘
var factorial = (function f(num) {
  if (num <= 1) {
    return 1;
  } else {
    return num * f(num - 1);
  }
});

// 取得窗口相对于屏幕左边和上边的距离
var leftPos = (typeof window.screenLeft = "number") ?
  window.screenLeft : window.screenX;
var topPos = (typeof window.screenTop = "number") ?
  window.screenTop : window.screenY;

// 取得页面视口宽高 IE9+
var pageWidth = window.innerWidth || document.documentElement.clientWidth,
  pageHeight = window.innerHeight || document.documentElement.clientHeight;

// 这个兼容所有
// pageWidth = document.documentElement.clientWidth
//
if (typeof pageWidth !== "number") {
  if (document.compatMode === "CSS1Compat") {
    pageWidth = document.documentElement.clientWidth;
    pageHeight = document.documentElement.clientHeight;
  } else {
    pageWidth = document.body.clientWidth;
    pageHeight = document.body.clientHeight;
  }
}

// 页面宽(包含滚动条和隐藏的部分)
// offsetWidth
var pageWidth = Math.max(document.documentElement.scrollWidth,
  document.documentElement.offsetWidth, document.documentElement.clientWidth,
  document.body.scrollWidth, document.body.offsetWidth);
// 解析地址中的参数

function getQueryStringArgs() {
  // 取得查询字符串并去掉开关头问号
  var qs = (location.search.length > 0 ? location.search.substring(1) : ""),
    // 保存数据对象
    args = {},
    items = qs.length ? qs.split('&') : [],
    item = null,
    name = null,
    value = null,
    i = 0,
    len = items.length;

  for (i = 0; i < len; i++) {
    item = tems[i].split('=');
    name = decodeURIComponent(item[0]);
    value = decodeURIComponent(item[1]);

    if (name.length) {
      args[name] = value;
    }
  }

  return args;
}

// 非IE下检测浏览器插件

function hasPlugin(name) {
  name = name.toLowerCase();

  for (var i = 0; i < navigator.plugins.length; i++) {
    if (navigator.plugins[i].name.toLowerCase.indexOf(name) > -1) {
      return true;
    }
  }

  return false;
}

// IE下检测插件
function hasIEPlugin(name) {
  try {
    new ActiveXObject(name);
    return true;
  } catch (ex) {
    return false;
  }
}

// 检测Flash

function hasFlash(name) {
  var result = hasPlugin("Flash");

  if (!result) {
    result = hasIEPlugin("ShockwaveFlash.ShockwaveFlash");
    return result;
  }
}

// 窗口可用宽和高
screen.availWidth;
screen.availHeight;

// 历史记录跳转
history.go();
history.back();
history.forward();

// 判断IE兼容模式
engine = null;
if (window.navigator.appName == "Microsoft Internet Explorer") {
  // This is an IE browser. What mode is the engine in?
  if (document.documentMode) // IE8
    engine = document.documentMode;
  else // IE 5-7
  {
    engine = 5; // Assume quirks mode unless proven otherwise
    if (document.compatMode) {
      if (document.compatMode == "CSS1Compat")
        engine = 7; // standards mode
    }
  }
  // the engine variable now contains the document compatibility mode.
}

// 输出脚本
document.write("<script type=\"text/javascript\" src=\"filepath\">" + "<\/script>");

// 关于<meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1"> h5bp做法不考虑IE7
// <meta http-equiv="X-UA-Compatible" content="IE=7,IE=9" /> /*MSDN*/推荐做法
IE8中新增加的标记

// 检测元素是否被包含在refNode中

function contains(refNode, otherNode) {
  if (typeof refNode.contains == "function" &&
    (!client.engine.webkit || client.engine.webkit >= 522)) {
    return refNode.contains(otherNode);
  } else if (typeof refNode.compareDocumentPosition == "function") {
    return !!(refNode.compareDocumentPosition(otherNode) & 16);
  } else {
    var node = otherNode.parentNode;
    do {
      if (node === refNode) {
        return true;
      } else {
        node = node.parentNode;
      }
    } while (node !== null);
    return false;
  }
}

function getContains() {
  alert(contains(document.documentElement, document.body));

}

// 获得元素的innerText
function getInnerText(element) {
  return (typeof element.textContent == 'string') ?
    element.textContent : element.innerText;
}

// 设置元素innerText
function setInnerText(element, text) {
  if (typeof element.textContent == 'string') {
    element.textContent = text;
  } else {
    element.innerText = text;
  }
}

// get方法往url上加数据
function addURLParam(url, name, value) {
  url += (url.indexOf("?") == -1 ? "?" : "&");
  url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
  return url;
}

var isExplorer = /msie [\w.]+/.exec(navigator.userAgent.toLowerCase());
判断是否ie
var docMode = document.documentMode;
var oldIE = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));
// content-types
text / plain //文字
text / HTML //html
text / xml / xml
test / javascript
application / json //当传输的是json字符串例如对象数组需要用到var objs = [{name: 'mike', val: 1}, {name: 'scot', val:2}];JSON.stringify(objs)
image / GIF
image / JPEG

// http://larryzhao.com/2011/10/28/arguments-dot-callee-dot-caller-bug-in-internet-explorer-9/
// IE9 bug
function func1(flag) {
  if (flag) {
    alert("Caller is here!");
  } else {
    func2();
  }
}

function func2() {
  arguments.callee.caller(true);
}
func1(false);
//bugfix:
function func1(flag) {
  if (flag) {
    alert("Caller is here!");
  } else {
    func2();
  }
}

function func2() {
  var callerFunc = func2.caller; //func2.caller或者是arguments.callee.caller
  callerFunc(true);
}
func1(false);

// 取得锚点对应的页面中元素
// 比如页面上有hash值#sec,页面上有元素<div id="sec"></div>
$(':target')

"1" [0] IE6, IE7返回undefined

// 判断是否同源
function isSameOrigin(el) {
  var ret = false;
  try {
    ret = !!el.contentWindow.location.href;
  } catch (e) {}
  return ret;
}
// 获取iframe内容
oFrame.contentDocument || oFrame.contentwindow.document;
~~和Math.floor是一样的意思都是取最小的整数

// custom date format and validate date
// usage: isValidDate('dd-mm-yyyy', '31/11/2012')
function isValidDate(value, userFormat) {

  // Set default format if format is not provided
  userFormat = userFormat || 'mm/dd/yyyy';

  // Find custom delimiter by excluding
  // month, day and year characters
  var delimiter = /[^mdy]/.exec(userFormat)[0];

  // Create an array with month, day and year
  // so we know the format order by index
  var theFormat = userFormat.split(delimiter);

  // Create array from user date
  var theDate = value.split(delimiter);

  function isDate(date, format) {
    var m, d, y, i = 0,
      len = format.length,
      f;
    for (i; i < len; i++) {
      f = format[i];
      if (/m/.test(f)) m = date[i];
      if (/d/.test(f)) d = date[i];
      if (/y/.test(f)) y = date[i];
    }
    return (
      m > 0 && m < 13 &&
      y && y.length === 4 &&
      d > 0 &&
      // Check if it's a valid day of the month
      d <= (new Date(y, m, 0)).getDate()
    );
  }

  return isDate(theDate, theFormat);
}

// get the maxHeight of the elements
// usage:$(elements).height( getMaxHeight($(elements)) );
var getMaxHeight = function($elms) {
  var maxHeight = 0;
  $elms.each(function() {
    // In some cases you may want to use outerHeight() instead
    var height = $(this).height();
    if (height > maxHeight) {
      maxHeight = height;
    }
  });
  return maxHeight;
};

// highlight text
/* usage: $('p').html( highlight(
    $('p').html(), // the text
    ['foo', 'bar', 'baz', 'hello world'], // list of words or phrases to highlight
    'strong' // custom tag
));
*/
function highlight(text, words, tag) {

  // Default tag if no tag is provided
  tag = tag || 'span';

  var i, len = words.length,
    re;
  for (i = 0; i < len; i++) {
    // Global regex to highlight all matches
    re = new RegExp(words[i], 'g');
    if (re.test(text)) {
      text = text.replace(re, '<' + tag + ' class="highlight">$&</' + tag + '>');
    }
  }

  return text;
}

// cancel highlight text
function unhighlight(text, tag) {
  // Default tag if no tag is provided
  tag = tag || 'span';
  var re = new RegExp('(<' + tag + '.+?>|<\/' + tag + '>)', 'g');
  return text.replace(re, '');
}

// create text effect
// usage: $('p').animateText(15, 'foo');
$.fn.animateText = function(delay, klass) {

  var text = this.text();
  var letters = text.split('');

  return this.each(function() {
    var $this = $(this);
    $this.html(text.replace(/./g, '<span class="letter">$&</span>'));
    $this.find('span.letter').each(function(i, el) {
      setTimeout(function() {
        $(el).addClass(klass);
      }, delay * i);
    });
  });
};

// fade elements one by one
$.fn.fadeAll = function(ops) {
  var o = $.extend({
    delay: 500, // delay between elements
    speed: 500, // animation speed
    ease: 'swing' // other require easing plugin
  }, ops);
  var $el = this;
  for (var i = 0, d = 0, l = $el.length; i < l; i++, d += o.delay) {
    $el.eq(i).delay(d).fadeIn(o.speed, o.ease);
  }
  return $el;
}

// cut out text and redundant words replace with ellipsis
function excerpt(str, nwords) {
  var words = str.split(' ');
  words.splice(nwords, words.length - 1);
  return words.join(' ') +
    (words.length !== str.split(' ').length ? '…' : '');
}

// judge responsive breakpoints
/* usage: if ( isBreakPoint(320) ) {
  // breakpoint at 320 or less
}*/
function isBreakPoint(bp) {
  // The breakpoints that you set in your css
  var bps = [320, 480, 768, 1024];
  var w = $(window).width();
  var min, max;
  for (var i = 0, l = bps.length; i < l; i++) {
    if (bps[i] === bp) {
      min = bps[i - 1] || 0;
      max = bps[i];
      break;
    }
  }
  return w > min && w <= max;
}

// count the click counts
$(element)
  .data('counter', 0) // begin counter at zero
  .click(function() {
    var counter = $(this).data('counter'); // get
    $(this).data('counter', counter + 1); // set
    // do something else...
  });

// embed youku video
/*usage:
embedYouku(
  'http://static.youku.com/v/swf/qplayer.swf',
  {'winType=adshow&VideoIDS=XMTE3NzQ0NTky&isAutoPlay=false&isShowRelatedVideo=false'}
);
*/
function embedYouku(link, ops) {
  var o = $.extend({
    width: 480,
    height: 320,
    params: ''
  }, ops);

  var id = /\?v\=(\w+)/.exec(link)[1];

  return '<embed allowFullScreen="true" id="embedid"  quality="high" width="' + o.width + '" height="' + o.height + '" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash" src="' + id + '?' + o.ops '"';
}

// create arbitrary dropdownmenu
/* usage:Dropdown select month
makeMenu(
  ['January:JAN', 'February:FEB', 'March:MAR'], // item:value
  ['select', 'option']
);
*/
function makeMenu(items, tags) {

  tags = tags || ['ul', 'li']; // default tags
  var parent = tags[0];
  var child = tags[1];

  var item, value = '';
  for (var i = 0, l = items.length; i < l; i++) {
    item = items[i];
    // Separate item and value if value is present
    if (/:/.test(item)) {
      item = items[i].split(':')[0];
      value = items[i].split(':')[1];
    }
    // Wrap the item in tag
    items[i] = '<' + child + ' ' +
      (value && 'value="' + value + '"') + '>' + // add value if present
      item + '</' + child + '>';
  }

  return '<' + parent + '>' + items.join('') + '</' + parent + '>';
}

// 创建原型方法的函数
if (typeof Function.prototype.method !== "function") {
  Function.prototype.method = function(name, func) {
    if (!this.prototype[name]) {
      this.prototype[name] = func;
      return this;
    }
  };
}


// trim trailing spaces
String.method("trim", function() {
  return this.replace(/^\s+|\s+$/g, "");
});

// get the nodes by className

function getByClass(oParent, sClass) {
  var aEle = oParent.getElementsByTagName('*');
  var aResult = [];
  var i = 0;

  for (i = 0; i < aEle.length; i++) {
    if (aEle[i].className == sClass) {
      aResult.push(aEle[i]);
    }
  }

  return aResult;
}

// detect array

function isArray(value) {
  if (typeof Array.isArray === "function") {
    return Array.isArray(value);
  }
  return Object.prototype.toString.call(value) === "[object Array]";
}

//query nodes under node
var walk_the_DOM = function walk(node, func) {
  func(node);

  node = node.firstChild;
  while (node) {
    walk(node, func);
    node = node.nextSibling;
  }
};

// getElementsByAttribute return the matched nodes which has the attr

var getElementsByAttribute = function(attr, value) {
  var results = [];

  walk_the_DOM(document.body, function(node) {
    var actual = node.nodeType === 1 && node.getAttribute(attr);
    if (typeof actual === "string" &&
      (actual === value || typeof value !== "string")) {
      results.push(node);
    }
  });

  return results;
}

// namespace创建命名空间防止重复
// useage:myApp.namespace("myApp.utils")
myApp.namesapce = function namespace(ns) {
  var parts = ns.split('.'),
    object = this,
    i, len;

  for (i = 0, len = parts.length; i < len; i++) {
    if (!object[parts[i]]) {
      object[parts[i]] = {};
    }
    object = object[parts[i]];
  }

  return object;
}

// 替换实体符
String.method("deentityify", function() {
  // The entity table.实体字符映射表
  var entity = {
    quot: "''",
    lt: "<",
    gt: ">"
  };

  // return deentityify method
  return function() {
    return this.replace(/&([^&;]+);/g,
      function(a, b) {
        var r = entity[b];
        return typeof r === "string" ? r : a;
      }
    );
  };
}());

// 数是前两个数的总和
var fibonacci = (function() {
  var memo = [0, 1];
  var fib = function(n) {
    var result = memo[n];
    if (typeof result !== "number") {
      result = fib(n - 1) + fib(n - 2);
      memo[n] = result;
    }

    return result;
  };
  return fib;
}());

/*记忆函数
*usage: var fibonacci = memoizer([0, 1], function(recur, n) {
    return recur(n - 1) + recur(n - 2);
})*/
var memoizer = function(memo, formula) {
  var recur = function(n) {
    var result = memo[n];
    if (typeof result !== "number") {
      result = formula(recur, n);
      memo[n] = result;
    }
    return result;
  };
  return recur;
};

/**
 * usage: function add(a, b) { return a + b; } var add1 = add.curly(1);var b = add1(7);
 * @return {[type]}
 */
Function.method("curry", function() {
  var slice = Array.prototype.slice,
    args = slice.apply(arguments),
    that = this;

  return function() {
    return that.apply(null, args.concat(slice.apply(arguments)));
  };
});

// global namespace
var chat = {
  // Create this closure to contain the cached modules
  module: function() {
    // Internal module cache.
    var modules = {};

    // Create a new module reference scaffold or load an
    // existing module.
    return function(name) {
      // If this module has already been created, return it.
      if (modules[name]) {
        return modules[name];
      }

      // Create a module and save it under this name
      return modules[name] = {
        Views: {}
      };
    };
  }()
};

// extend namespace

function extend(destination, source) {
  var toString = Object.prototype.toString,
    objTest = toString.call({});
  for (var property in source) {
    if (source[property] && objTest == toString.call(source[property])) {
      destination[property] = destination[property] || {};
      extend(destination[property], source[property]);
    } else {
      destination[property] = source[property];
    }
  }
  return destination;
};

// 为任意的对象添加事件
var eventuality = function(that) {
  var registry = {};

  that.fire = function(event) {
    // 对象上触发事件,事件参数可是事件名或者是事件对象
    // on注册的事件将被调用

    var array,
      func,
      handler,
      i,
      type = typeof event === "string" ? event : event.type;

    // 如果有这个事件的事件句柄则会按顺序执行函数
    if (registry.hasOwnProperty(type)) {
      array = registry[type];
      for (i = 0; i < array.length; i++) {
        handler = array[i];


        // 事件句柄含有一个方法和一个可选的数列参数如果函数是一个名字就会
        // 遍历整个函数
        func = handler.method;
        if (typeof func == "string") {
          func = this[func];
        }

        // 调用事件句柄。如果用传入的参数或者事件参数

        func.apply(this,
          handler.parameters || [event]);
      }
    }
    return this;
  };

  that.on = function(type, method, parameters) {
    // 注册事件。如果没有事件句柄纪录就把它放入事件句柄数列中

    var handler = {
      method: method,
      parameters: parameters
    };

    if (registry.hasOwnProperty(type)) {
      registry[type].push(handler);
    } else {
      registry[type] = [handler];
    }
    return this;
  };

  return that;
};

// reduce 传入一个callback进行相应的操作
// usage: var add = function(a, b) { return a + b; }
// var data = [1, 2, 3];data.reduce(add, 4);
Array.method("reduce", function(f, value) {
  var i;

  for (i = 0; i < this.length; i++) {
    value = f(this[i], value);
  }

  return value;
});

// Array.dim初始化数组的值
Array.dim = function(dimension, initial) {
  var a = [],
    i;
  for (i = 0; i < dimension; i++) {
    a[i] = initial;
  }
  return a;
}

// Array.matrix初始化多维数组
Array.matrix = function(m, n, initial) {
  var a, i, j, mat = [];
  for (i = 0; i < m; i++) {
    a = [];
    for (j = 0; j < n; j++) {
      a[j] = initial;
    }
    mat[i] = a;
  }

  return mat;
};

// 比较数列中的字母和数字
// 比如["a", 1, 6, 3, "d", "c"]
m.sort(function(a, b) {
  if (a === b) {
    return 0;
  }

  if (typeof a === typeof b) {
    return a < b ? -1 : 1;
  }

  return typeof a < typeof b ? -1 : 1;
});

// 数组对象中的排序
var by = function(name, minor) {
  return function(o, p) {
    var a, b;

    if (o && p && typeof o === "object" && typeof p === "object") {
      a = o[name];
      b = p[name];
      if (a === b) {
        return typeof minor === "function" ? minor(o, p) : 0;
      }

      if (typeof a === typeof b) {
        return a < b ? -1 : 1;
      }

      return typeof a < typeof b ? -1 : 1;
    } else {
      throw {
        name: "Error",
        message: "Expected an object when sorting by " + name;
      };
    }
  };
};

// 绑定函数
Function.method("bind", function(that) {
  var method = this,
    slice = Array.prototype.slice,
    args = slice.apply(arguments, [1]);

  return function() {
    return method.apply(that,
      args.concat(slice.apply(arguments, [0])));
  };
});

// 返回replace方法返回的结果
String.method("entityify", function() {

  var character = {
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp",
    "'": "&quot;"
  };

  return function() {
    return this.replace(/[<>&"]/g, function(c) {
      return character[c];
    });
  };
}());

// 判断是否数字
var isNumber = function isNumber(value) {
  return typeof value === "number" && isFinite(value);
}

// 检测对象中的属性是否存在

function hasPrototypeProperty(object, name) {
  return !object.hasOwnProperty(name) && (name in object);
}

// 注意jQuery或者原生也是这样的中当利用data获取元素的data属性的时候data-后面的脚本里面都必须写成小写HTML上面可以写大写
比如
data('nameId') 必须写成 data('nameid')

// innerHTML元素里面添加脚本
div.innerHTML = "_<script defer>alert('hi');<\/script>";
div.innerHTML = "<div>&nbsp;</div><script defer>alert('hi');<\/script>";
div.innerHTML = "<input type=\"hidden\"><script defer>alert('hi');<\/script>"; //常用此种
当添加
style元素进去也和添加 script脚本一样

// insertAdjacentHTML
ff8 + 和其它

// scrollIntoView html5
让某元素进入视图: el.scrollIntoView(),
  IE,
  Firefox,
  Safari和 Opera

把数据切成块？
var data = [12, 123, 1234, 453, 436, 23, 23, 5, 4123, 45, 346, 5634, 2234, 345, 342];

function chunk(array, process, context) {
  setTimeout(function() {
    var item = array.shift();
    process.call(context, item);

    if (array.length > 0) {
      setTimeout(arguments.callee, 100);
    }
  }, 100);
}

function printValue(item) {
  var div = document.getElementById("myDiv");
  div.innerHTML += item + "<br>";
}

chunk(data, printValue);

// 函数节流防止重复执行代码例如resize设定定时器先清除再执行

var constant = (function() {
  var constants = {},
    ownProp = Object.prototype.hasOwnProperty,
    allowed = {
      string: 1,
      number: 1
    };
  prefix = (Math.random() + "_").slice(2);

  return {
    set: function(name, value) {
      if (this.isDefined(name)) {
        return false;
      }

      if (!ownProp.call(allowed, typeof value)) {
        return false;
      }

      constants[prefix + name] = value;
      return true;
    },
    isDefined: function(name) {
      return ownProp.call(constants, prefix + name);
    },
    get: function(name) {
      if (this.isDefined(name)) {
        return constants[prefix + name];
      }

      return null;
    }
  }
});

//判断是否是数字
+
data + "" === data

// 获得元素的在屏幕上的位置坐标绝对坐标
function findPos(obj) {
  var curleft = curtop = 0;

  if (obj.offsetParent) {
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);
  }

  return [curleft, curtop];
}

function offset(node) {
  var left = 0,
    top = 0;

  do {
    left += node.offsetLeft;
    top += node.offsetTop;
  } while (node = node.offsetParent);

  return {
    left: left,
    top: top
  };

}
// 设置一个唯一标识符
var uuid = function() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// 函数的形参个数
fn.length

//字符串内按任意位数的字符进行反转

function flip(s, offset) {
  var len = s.length;
  offset = offset < len ? offset : (offset % len);
  return s.replace(new RegExp('^(.{' + offset + '})(.*)$'), '$2$1');
}

// getAttribute 第二个参数 DOM2
0
Default.Performs a property search that is not
case -sensitive, and returns an interpolated value
if the property is found.
1
Performs a
case -sensitive property search.To find a match, the uppercase and lowercase letters in strAttributeName must exactly match those in the attribute name.
2
Returns attribute value as a String.This flag does not work
for event properties.
4
Returns attribute value as a fully expanded URL.Only works
for URL attributes.

// 快速排序
var quickSort = function(arr) {　　
  if (arr.length <= 1) {
    return arr;
  }　　
  var pivotIndex = Math.floor(arr.length / 2);　　
  var pivot = arr[pivotIndex];　　
  var left = [];　　
  var right = [];　　
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] != pivot) {
      if (arr[i] < pivot) {　　　　　　
        left.push(arr[i]);　　　　
      } else {
        right.push(arr[i]);　　　
      }　
    }
  }　　　　
  return quickSort(left).concat([pivot], quickSort(right));
};

// 输入一个整数数组，调整数组中数字的顺序，使得所有奇数位于数组的前半部分，并排序。
// 所有偶数位于数组的后半部分。
// 如： [4,6,5,3,7] -> [3,5,7,4,6]
var a = [1, 3, 11, 2, 4, 10];
a.sort(function(a, b) {
  return b - a;
}).sort(function(a, b) {
  return a % 2 ? b % 2 : 1;
})

// 对象的toString或者valueOf会在进行运算的时候进行转化
var a = {
    toString: function() { //或者valueOf
      return 2;
    }
  }
  // IE6-IE8 substr参数不支持负数应该用substring
substring

// 测试是否是空数组
var obj;
var length = obj.length;
if (length !== +length) { //如果不是数组或者是对象

}
NaN !== NaN //true

//是否是IE6，7，8
var isIE678 = !+'\v1';
// IE6,IE7
!"1" [0]
// trim

function trim(str) {
  var whitespace = ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\n\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
  for (var i = 0; i < str.length; i++) {
    if (whitespace.indexOf(str.charAt(i)) === -1) {
      str = str.substring(i);
      break;
    }
  }

  for (i = str.length - 1; i >= 0; i--) {
    if (whitespace.indexOf(str.charAt(i)) === -1) {
      str = str.substring(0, i + 1);
      break;
    }
  }

  return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}

// window.open

function openUrl(url) {
  var f = document.createElement("form");
  f.setAttribute("action", url);
  f.setAttribute("method", 'get');
  f.setAttribute("target", '_black');
  document.body.appendChild(f)
  f.submit();
}

~~双取反可以转换浮点数为整数

单取反为~
num如果为 - 1 的话返回为 0
// IE6,IE7下不返回数组长度
if ([].unshift(1) !== 1) {
  var _unshift = Array.prototype.unshift;
  Array.prototype.unshift = function() {
    _unshift.apply(this, arguments);
    return this.length;
  }
}
if ([1, 2, 3].splice(1).length == 0) { //IE6,7,8默认第二个参数为0,其它浏览器为数组长度
  var _splice = Array.prototype.splice;
  Array.prototype.splice = function(a) {
    if (arguments.length == 1) {
      return _splice.call(this, a, this.length);
    } else {
      return _splice.apply(this, arguments);
    }
  }
}
// IE6,IE7中的日期存在bug
if ((new Date).getYear() > 1990) {
  Date.prototype.getYear = function() {
    return this.getFullYear() - 1900;
  };
  Date.prototype.setYear = function(year) {
    return this.setFullYear(year);
  }
}
// IE7 a 标签href.replace(/.*(?=#[^\s]*$)/, '')否则会自动添加域名+href里面的内容.
// 循环
outerLoop:
  for (var i = 0; i < 5; i++) {
    if (i == 4) {
      break outerLoop;
    }
  }

  // 继承
  function extend(destination, source) {
    for (var property in source) {
      destination[property] = source[property];
    }
    return destination;
  }

  function inherit(init, Parent, proto) {
    function Son() {
      Parent.apply(this, argument); //先继承父类的特权成员
      init.apply(this.arguments); //再执行自己的构造器
    }

    Son.prototype = Object.create(Parent.prototype, {});
    Son.prototype.toString = Parent.prototype.toString;
    Son.prototype.valueOf = Parent.prototype.valueOf;
    Son.prototype.constructor = Son;
    extend(Son.prototype, proto);
    extend(Son, Parent);
    return Son;
  }

  // 获取所有的子节点
  function getChildren(el) {
    if (el.childElementCount) {
      return [].slice.call(el.children);
    }
    var ret = [];
    for (var node = el.firstChild; node; node = node.nextSibling) {
      node.nodeType = 1 && ret.push(node);
    }
    return ret;
  }

  // element.insertAdjacentHTML(position, html),在元素对应位置插入html
  // position:beforebegin

  // create 不可见的document
  // var doc = document.implementation.createHTMLDocument('Test');

  // HTML5
  // <input value="data" id="data-field">
  // var textbox = document.getElementById('data-field');
  // textbox.setSelectionRange(1, 3), 选取单词
  // textbox.selectionStart,textbox.selectionEnd选取的单词的头的索引和尾的索引

  // xhr2
  var data = new FormData();
  data.append('age', 25);
  // elementFromPoint
  // 在离viewport的相对坐标以内的元素
  // IE8以下 getElementById会有bug元素的name与id会混淆

  // document.createElement
  // IE6-8中input和iframe创建元素name属性不能够修改只能通过类似document.createElement('<input name="mike" />');

  // createContextualFragment FF的私有实现与insertAdjacentHTML差不多只是允许转换为文档碎片再插入.

  // createRange创建一组节点
  // clearAttribures 清除元素属性
  // mergeAttributes 复制对象的属性

  // iframe当在IE6,IE7的时候不能够直接用.name必须直接写在属性上面

  // 动态创建iframe chrome会触发两次iframe的onload事件(当src是在创建元素之后才赋与src值)

  // document.documentMode只IE支持

  // getComputedStyle IE9+现代浏览器

  // window.exeScript IE6,7,8.window.eval IE9+标准浏览器

  // mediator pattern
  var mediator = (function() {
    var subscribe = function(channel, fn) {
        if (!mediator.channels[channel]) mediator.channels[channel] = [];
        mediator.channels[channel].push({
          context: this,
          callback: fn
        });
        return this;
      },

      publish = function(channel) {
        if (!mediator.channels[channel]) return false;
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0, l = mediator.channels[channel].length; i < l; i++) {
          var subscription = mediator.channels[channel][i];
          subscription.callback.apply(subscription.context, args);
        }
        return this;
      };

    return {
      channels: {},
      publish: publish,
      subscribe: subscribe,
      installTo: function(obj) {
        obj.subscribe = subscribe;
        obj.publish = publish;
      }
    };

  }());

  // jQuery module pattern
  function library(module) {
    $(function() {
      if (module.init) {
        module.init();
      }
    });
    return module;
  }

  var myLibrary = library(function() {
    return {
      init: function() {
        /*implementation*/
      }
    };
  }());

  // 样式字符串
  cssText

  // tabIndex在标准浏览器下,表单元素和链接返回0，IE6-IE8返回0

  // a 标签比如<a href="www.baidu.com">www.baidu.com</a> 链接的href属性和innerText值一样并且没有子节点就会导致$('#link').attr('href', 'www.baidu.com');的时候会改变innerText的值

  // IE下的pageX,pageY有出入
  // scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  // scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
  // e.pageX = e.clientX + scrollLeft,e.pageY = e.clientY + scrollTop

  // IE5-7及全系列怪异模式下会有左面左上角2px
  if (event.pageX == null && event.clientX != null) {
    var doc = event.target.ownerDocument || document,
      box = document.compatMode == 'BackCompat' ? doc.body : doc.documentElement;

    event.pageX = event.clientX + (box && box.scrollLeft || 0) - (box && box.clientLeft || 0);
    event.pageY = event.clientY + (box && box.scrollTop || 0) - (box && box.clientTop || 0);
  }

  // this.select,input 为text的时候聚焦

  //缓存cache-control优先级
  Cache - Control > max - age > Expires, Last - Modified
  max - age在Last - Modified之

  function sendRequest(url, callback, postData) {
    var req = createXMLHTTPObject();
    if (!req) return;
    var method = (postData) ? "POST" : "GET";
    req.open(method, url, true);
    req.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
    if (postData)
      req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    req.onreadystatechange = function() {
      if (req.readyState != 4) return;
      if (req.status != 200 && req.status != 304) {
        //			alert('HTTP error ' + req.status);
        return;
      }
      callback(req);
    }
    if (req.readyState == 4) return;
    req.send(postData);
  }

  var XMLHttpFactories = [
    function() {
      return new XMLHttpRequest()
    },
    function() {
      return new ActiveXObject("Msxml2.XMLHTTP")
    },
    function() {
      return new ActiveXObject("Msxml3.XMLHTTP")
    },
    function() {
      return new ActiveXObject("Microsoft.XMLHTTP")
    }
  ];

  function createXMLHTTPObject() {
    var xmlhttp = false;
    for (var i = 0; i < XMLHttpFactories.length; i++) {
      try {
        xmlhttp = XMLHttpFactories[i]();
      } catch (e) {
        continue;
      }
      break;
    }
    return xmlhttp;
  }

  // 对字符串的操作
  function contains(target, it) {
    return target.indexOf(it) != -1;
  }

  // 判断是否以字符串开头或结尾
  function startsWith(target, str, ignorecase) {
    var start_str = target.substr(0, str.length);
    return ignorecase ? start_str.toLowerCase() === str.toLowerCase() :
      start_str === str;
  }

  function endsWith(target, str, ignorecase) {
    var end_str = target.substr(target.length - str.length);
    return ignorecase ? end_str.toLowerCase() === str.toLowerCase() :
      end_str === str;
  }
  // 重复生成字符
  function repeat(target, n) {
    var s = target,
      total = '';
    while (n > 0) {
      if (n % 2 == 1) {
        total += s;
      }
      if (n == 1) break;
      s += s;
      n = n >> 1;
    }
    return total;
  }
  // 字符串长度包含汉字
  function byteLen(target) {
    var byteLength = target.length,
      i = 0;
    for (; i < target.length; i++) {
      if (target.charCodeAt(i) > 255) {
        byteLength++;
      }
    }
    return byteLength;
  }
  // 可设定保存的汉字的长度fix为汉字长度
  function byteLen(target, fix) {
    fix = fix ? fix : 2;
    var str = new Array(fix + 1).join('-');
    return target.replace(/[^\x00-\xff]/g, str).length;
  }
  // 截取字符
  function truncate(target, length, truncation) {
    length = length || 30;
    truncation = truncation == void(0) ? '...' : truncation;
    return target.length > length ?
      target.slice(0, length - truncation.length) + truncation : String(target);
  }
  // pad数字补0或者其它比如日期
  function pad(target, n, filling, right, radix) {
    var num = target.toString(radix || 10);
    filling = filling || '0';
    while (num.length < n) {
      if (!right) {
        num = filling + num;
      } else {
        num += filling;
      }
    }
    return num;
  }

  // 简单的format
  // example: var a = format('Result is #{0} #{1}', 22, 23);
  function format(str, object) {
    var array = Array.prototype.slice.call(arguments, 1);
    return str.replace(/\\?\#{([^{}]+)\}/gm, function(match, name) {
      if (match.charAt(0) == '\\') {
        return match.slice(1);
      }
      var index = Number(name);
      if (index >= 0) {
        return array[index];
      }
      if (object && object[name] !== void 0) {
        return object[name];
      }
      return '';
    });
  }

  // quote方法在字符串两端添加双引号在内部需要转义的地方进行转义

  IE9以下不支持数组indexOf
  img onerror IE下Stack overflow at line: 0 错误是由于onerror的图片也不存在引起的.
  onerror = "this.onerror='';this.src='/Images/img/error-car.png'"
  来解决.
  IE7上的a href会自动加上域名.href = $(this).attr('href').replace(/.*(?=#[^\s]*$)/, ''), //strip for ie7
    关于tbodyIE8在创建table的时候ie6, 7 会

  //关于parseInt,IE9以下有bug
  parseInt("09") 之类的以0开头的会转化为0必须写上进制parseInt("09", 10)

  function type(param) {​
    return Object.prototype.toString.call(param).slice(8, -1);
  }

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
  var clone = (function() {
    var F = function() {};
    return function(proto) {
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
  function getElementsByClassName(target, className) {
    // if support getElementsByClassName
    if (target.getElementsByClassName) {
      return target.getElementsByClassName(className);
    } else {
      var childList = target.getElementsByTagName('*'),
        result = [];
      for (var i = 0; i < childList.length; i++) {
        var child = childList[i];
        if (child.className.indexOf(className) > -1) {
          result.push(child);
        }
      }
      return result;
    }
  }

  // 设置元素的内容firefox不支持innerText
  // ie support innerText which is a ie-specified of w3c standard textContent
  // innerText is IE's implementation of the actual W3C standard of textContent
  // textContent IE9 and above
  if (dom.innerText) {

  } else {
    dom.textContent
  }
  // 兼容element.dataset
  function getDataSet(dom) {
    // if support dataset
    if (dom.dataset) {
      return dom.dataset;
    } else {

    }
  }

  function setDataSet(dom) {
    // if support dataset
    if (dom.dataset) {
      return dom.dataset;
    } else {
      // if ()
    }
  }

  //设置过期时间
  function setCookie(c_name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) +
      ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
  }

// 获取window对象但是在严格模式下不起作用
var global = (function () {
   return this;
}());
