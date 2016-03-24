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
    return Object.prototype.toString().call(value) === "[object Array]";
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
data('nameId')必须写成 data('nameid')

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
+ data + "" === data

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
!"1"[0]
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
num如果为 - 1的话返回为 0
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
    Date.prototype.getYear = function () {
        return this.getFullYear() - 1900;
    };
    Date.prototype.setYear = function (year) {
        return this.setFullYear(year);
    }
}
// IE7 a 标签href.replace(/.*(?=#[^\s]*$)/, '')否则会自动添加域名+href里面的内容.
// 循环
outerLoop: for (var i = 0; i < 5; i++) {
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
var mediator = (function(){
    var subscribe = function(channel, fn){
        if (!mediator.channels[channel]) mediator.channels[channel] = [];
        mediator.channels[channel].push({ context: this, callback: fn });
        return this;
    },

    publish = function(channel){
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
        installTo: function(obj){
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
Cache-Control > max-age > Expires,Last-Modified
max-age在Last-Modified之
