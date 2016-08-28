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

var isExplorer = /msie [\w.]+/.exec(navigator.userAgent.toLowerCase());判断是否ie
var docMode           = document.documentMode;
var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));
// content-types
text/plain //文字
text/HTML //html
text/xml /xml
test/javascript
application/json //当传输的是json字符串例如对象数组需要用到var objs = [{name: 'mike', val: 1}, {name: 'scot', val:2}];JSON.stringify(objs)
image/GIF
image/JPEG

// http://larryzhao.com/2011/10/28/arguments-dot-callee-dot-caller-bug-in-internet-explorer-9/
// IE9 bug
function func1(flag){
   if(flag){
      alert("Caller is here!");
   }else {
      func2();
   }
}

function func2(){
    arguments.callee.caller(true);
}
func1(false);
//bugfix:
function func1(flag){
   if(flag){
      alert("Caller is here!");
   }else {
      func2();
   }
}

function func2(){
   var callerFunc = func2.caller; //func2.caller或者是arguments.callee.caller
   callerFunc(true);
}
func1(false);

// 取得锚点对应的页面中元素
// 比如页面上有hash值#sec,页面上有元素<div id="sec"></div>
$(':target')

"1"[0] IE6,IE7返回undefined

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
