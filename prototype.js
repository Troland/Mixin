// 超类
Object.method("superior", function(name) {
    var that = this,
        method = that[name];

    return function() {
        return method.apply(that, arguments);
    };
});

// 类继承
// usage: var newFunc = function(name) { this.name = name; }.inherits(anotherfunc);
Function.method("inherits", function(Parent) {
    this.prototype = new Parent();
    return this;
});

// 创建子类subType:子类,superType:超类,寄生组合式

function inheritPrototype(subType, superType) {
    var prototype = Object.create(super.prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
}

// Object inheritance
if (typeof Object.create !== "function") {
    Object.create = function(o) {
        var F = function() {};
        F.prototype = o;
        return new F();
    };
}

// 类扩展等

function myLib() {

}

Nature.prototype.createClass = function(definitions, extra_definitions) {
    var klass = function() {
        this.initialize.apply(this, arguments);
    };

    jQuery.extend(klass.prototype, definitions);

    if (extra_definitions) {
        jQuery.extend(klass.prototype, extra_definitions);
    }

    return klass;
};

Nature.prototype.extendClass = function(baseClass, methods) {
    var klass = function() {
        this.initialize.apply(this, arguments);
    };

    jQueyr.extend(klass.prototype, baseClass.prototype);
    jQuery.extend(klass.prototype, methods);

    return klass;
};

// usage
// create a library
var Modularity = new myLib();

// Create new class
var DisplayModule = Modularity.createClass({
    initialize: function() {},

    display: function(connector) {
        console.log("display");
    }
});

// Create instance of class
var displayObject = new DisplayModule();

// Call instance function
displayObject.display();

/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function() {
    var initializing = false,
        fnTest = /xyz/.test(function() {
            xyz;
        }) ? /\b_super\b/ : /.*/;

    // The base Class implementation (does nothing)
    this.Class = function() {};

    // Create a new Class that inherits from this class
    Class.extend = function(prop) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" &&
                typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                (function(name, fn) {
                return function() {
                    var tmp = this._super;

                    // Add a new ._super() method that is the same method
                    // but on the super-class
                    this._super = _super[name];

                    // The method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;

                    return ret;
                };
            })(name, prop[name]) :
                prop[name];
        }

        // The dummy class constructor

        function Class() {
            // All construction is actually done in the init method
            if (!initializing && this.init)
                this.init.apply(this, arguments);
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
    };
})();

// 检测IE怪癖检测某个实例属性有一与原型属性一样的IE8及更早不会出现在for-in中
var hasDontEnumQuirk = function() {

    var o = {
        toString: function() {}
    };

    for (var prop in o) {
        if (prop === "toString") {
            return false;
        }
    }

    return true;
}();

// safari3及版本会显示被隐藏的属性
var hasEnumShadowsQuirk = function() {

    var o = {
        toString: function() {}
    },
        count = 0;

    for (var prop in o) {
        if (prop === "toString") {
            count++;
        }
    }

    return (count > 1);
}

//  组合继承

    function superClass(name) {
        this.name = name;
    }

superClass.prototype.say = function() {
    return this.name;
}

function subClass(name, age) {
    SuperClass.call(this, name);
    this.age = age;
}

subClass.prototype.say = function() {
    return this.name;
}

// 转换NodeList为数组

function convertToArray(nodes) {
    var array = null;
    try {
        array = Array.prototype.slice.call(nodes, 0); //针对非IE浏览器
    } catch (e) {
        array = new Array();
        for (var i = 0, len = nodes.length; i < len; i++) {
            array.push(nodes[i]);
        }
    }

    return array;
}

// IE6 及以前版本不支持removeAttribute,还有就是为DOM元素添加自定义属性
// IE可以getAttribute或者dom.id等方法获得但是其它浏览器不行

// 输出节点的所有属性并组成对象

function outputAttributes(el) {
    var pairs = [],
        attrName,
        attrValue,
        i,
        len;

    for (i = 0, len = el.attributes.length; i < len; i++) {
        attrName = el.attributes[i].nodeName;
        attrValue = el.attributes[i].attrValue;
        if (el.attributes[i].specified) {
            pairs.push(attrName + "=\"" + attrValue + "\"");
        }
    }

    return pairs.join(" ");
}

// 动态创建的元素IE下有问题必须用createElement("<iframe id=\"myNewDiv\" class=\"box\"></iframe>")类似的
// 分别有几个元素需要这样设置iframe,input等

if (client.browser.ie && client.browser.ie <= 7) {

    // 创建一个带name特性的iframe元素
    var iframe = document.createElement("<iframe name=\"myframe\"></iframe>");

    // 创建input元素
    var input = document.createElement("<input type=\"checkbox\">");

    // 创建button元素
    var button = document.createElement("<button type=\"reset\"></button>");

    // 创建单选按钮
    var radio1 = document.createElement("<input type=\"radio\" name=\"choice\" " + "value=\"1\">");

    var radio2 = document.createElement("<input type=\"radio\" name=\"choice\" " + "value=\"2\">");
}

// normalize可以把元素里面的多个文本节点串起来
![CDATA[This is some content.]]

// DocumentFragment nodeType为11

// 加载js

function loadScript(url) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    document.body.appendChild(script);
}

// 加载js代码

function loadScriptString(code) {

    var script = document.createElement('script');
    script.type = 'text/javascript';
    try {
        script.appendChild(document.createTextNode(code));
    } catch (ex) {
        script.text = code;
    }
    document.body.appendChild(script);
}

// 加载css字符串

function loadStyleString(css) {
    var style = document.createElement("style");
    style.type = "text/css";

    try {
        style.appendChild(document.createTextNode(css));
    } catch (ex) {
        style.styleSheet.cssText = css;
    }

    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
}

function addStyle() {
    loadStyleString("body{background-color:red}");
}

// load css style

function loadStyles(url) {
    var link = document.createElement('link'),
        head = document.body.getElementsByTagName('head')[0];

    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;

    head.appendChild(link);
}

// 注意缓存从nodeList下来的值
比如
var divs = document.getElementsByTagName('div');
len = divs.length;

// 可以通过item()这样来访问节点

// 判断节点是否含有指定的选择符

function matchesSelector(element, selector) {
    if (element.matchesSelector) {
        return element.matchesSelector(selector);
    } else if (element.msMatchesSelector) {
        return element.msMatchesSelector(selector);
    } else if (element.mozMatchesSelector) {
        return element.mozMatchesSelector(selector);
    } else if (element.webkitMatchesSelector) {
        return element.webkitMatchesSelector(selector);
    } else {
        throw new Error("Not supported.");
    }
}

if (matchesSelector(document.body, "body.page1")) {
    alert("It's page 1!");
}

// hasFocus html5
document.hasFocus();
// 焦点管理 获得有了焦点的元素html5
document.activeElement

// document.readyState
document.readyState文档状态值有 "complete"

// IE模式
document.compatMode标准: CSS1Compat,
混杂模式: BackCompat

// document.head html5

// document.documentMode,IE8新增
// 关于<meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">
// 指向拥有给定文档的窗口
var parentWindow = document.defaultView || document.parentWindow;

// 创建一个XHTML文档
var doctype = document.implementation.createDocumentType("html",
    " -//W3C//DTD XHTML 1.0 Strict//EN",
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd");

var doc = document.implementation.createDocument("http://www.w3.org/1999/xhtml",
    "html", doctype);
// 创建一个HTML
var htmldoc = document.implementation.createHTMLDocument("New Doc");

// DOM3 设置用户数据
document.body.setUserData('name', 'Nicholas', function() {});

// 访问框架当中的文档对象
var iframe = document.getElementById('myiframe');
var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

// css float浮动
非
IE是使用 style.cssFloat, IE是 styleFloat
cssText可以重写元素整个样式

// 获取样式
非 IE: document.defaultView.getComputedStyle(element, null)
IE: element.currentStyle;

// 获得样式表对象

function getStyleSheet(element) {
    return element.sheet || element.styleSheet;
}

function insertRule(sheet, selectorText, cssText, position) {
    if (sheet.insertRule) {
        sheet.insertRule(selectorText + "{" + cssText + "}", position);
    } else if (sheet.addRule) {
        sheet.addRule(selectorText, cssText, position);
    }
}

function deleteRule(sheet, index) {
    if (sheet.deleteRule) {
        sheet.deleteRule(index);
    } else if (sheet.removeRule) {
        sheet.removeRule(index);
    }
}

function addNewRule() {
    var sheet = document.styleSheets[0];
    insertRule(sheet, "body", "background-color: silver;", 0);
    //Note: Opera < 9.5 doesn't add the rule in the correct location     
}

function removeFirstRule() {
    var sheet = document.styleSheets[0];
    deleteRule(sheet, 0);
}

// 获得视口的坐标

function getViewport() {
    if (document.compatMode == "BackCompat") {
        return {
            width: document.body.clientWidth,
            height: document.body.clientHeight
        }
    } else {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        }
    }
}

// 获得元素的相对于视口位置

function getElementLeft(element) {
    var actualLeft = element.offsetLeft;
    var current = element.offsetParent;

    while (current !== null) {
        actualLeft += current.offsetLeft;
        current = current.offsetParent;
    }

    return actualLeft;
}

function getElementTop(element) {
    var actualTop = element.offsetTop;
    var current = element.offsetParent;

    while (current !== null) {
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }

    return actualTop;
}

function getBoundingClientRect(element) {

    var scrollTop = document.documentElement.scrollTop;
    var scrollLeft = document.documentElement.scrollLeft;

    if (element.getBoundingClientRect) {
        if (typeof arguments.callee.offset != "number") {
            var temp = document.createElement("div");
            temp.style.cssText = "position:absolute;left:0;top:0;";
            document.body.appendChild(temp);
            arguments.callee.offset = -temp.getBoundingClientRect().top - scrollTop;
            document.body.removeChild(temp);
            temp = null;
        }

        var rect = element.getBoundingClientRect();
        var offset = arguments.callee.offset;

        return {
            left: rect.left + offset,
            right: rect.right + offset,
            top: rect.top + offset,
            bottom: rect.bottom + offset

        };
    } else {

        var actualLeft = getElementLeft(element);
        var actualTop = getElementTop(element);

        return {
            left: actualLeft - scrollLeft,
            right: actualLeft + element.offsetWidth - scrollLeft,
            top: actualTop - scrollTop,
            bottom: actualTop + element.offsetHeight - scrollTop
        }
    }
}


function getDimensions() {
    var rect = getBoundingClientRect(document.getElementById("myDiv"));
    alert("left: " + rect.left + "\nright: " + rect.right + "\ntop: " + rect.top + "\nbottom: " + rect.bottom);
}
// 设定范围
createRange

// IE8不支持但是支持createTextRange()

// IE attachEvent中的 匿名函数中this=window,而其它是就是被触发元素

// preventDefault()是由cancelable:这个属性是否可以true就用
// stopPropagation()是由bubbles:为true就用

// eventPhase:1代表在捕获阶段,2代表处于目标阶段3代表处于冒泡阶段

IE中取消冒泡 cancelBubble = true.取消默认行为是returnValue = false
cancelBubble赞同于 stopPropagation(), returnValue等同于 preventDefault()

// 用implemetataion来检测是否支持某项功能 
var isSupported = document.implemetation.hasFeature('UIEvent', '3.0');

EventUtil.addHandler('window', 'scroll', function(event) {
    if (document.compatMode == 'CSS1Compat') {
        alert(document.documentElement.scrollTop);
    } else {
        alert(document.body.scrollTop);
    }
});

// 鼠标事件中只有mouseenter和mouseleave不会冒泡

// clientX,clientY并不包含滚动的距离

// pageX,pageY包含滚动距离
pageX = event.pageX,
pageY = event.pageY;

if (pageX === undefined) {
    pageX = event.clientX + (document.body.scrollLeft ||
        document.documentElement.scrollLeft);
}

if (pageY === undefined) {
    pageY = event.clientY + (document.body.scrollTop ||
        document.documentElement.scrollTop);
}

// 当按下字符键选触发keydown-keypress-keyup,非字符时是keydown-keyup

contextmenu事件右键菜单事件可以自定义右键
beforeunload事件是为了询问用户是否想离开页面 event.returnValue = "你想离开吗?"

// DOMContentLoaded页面加载完成事件不支持的用readyState

EventUtil.addHandler(window, "DOMContentLoaded", function(event) {
    alert("Content loaded.");
});

// 下面的例子只是css加载只有IE支持
EventUtil.addHandler(window, "load", function() {

    //create a new <script/> element.
    var script = document.createElement("script");
    EventUtil.addHandler(script, "readystatechange", function(event) {
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
        if (target.readyState == "loaded" || target.readyState == "complete") {
            EventUtil.removeHandler(target, "readystatechange", arguments.callee);
            alert("Script Loaded");
        }
    });
    script.src = "example.js";
    document.body.appendChild(script);

    //create a new <link/> element
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";

    EventUtil.addHandler(link, "readystatechange", function(event) {
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
        if (target.readyState == "loaded" || target.readyState == "complete") {
            EventUtil.removeHandler(target, "readystatechange", arguments.callee);
            alert("CSS Loaded");
        }
    });
    link.href = "example.css";
    document.getElementsByTagName("head")[0].appendChild(link);

});

// hashchange事件IE8之前不支持

// 移动设备事件
orientationchange事件当 IOS设备转换方向时候触发

// deviceorientation事件响应设备的方向并让屏幕上的元素发生变化

// devicemotion事件

// ios开发
touchstart等事件

// 模拟事件鼠标事件或者键盘事件还有变动事件
createEvent无法完全模拟比如键盘输入
// 只要是通过onload注册的事件程序都要通过onunload来卸载

// 表单可以通过form2(表单名称).elements来访问

// 防止重复提交submit事件中设置按钮的disabled=true

// html5有一个autofocus属性
通过设置 tabIndex为 - 1再调用 focus()可以让元素获得焦点

// 可以用select()方法让获得焦点的时候选择文本框中的所有文本
select事件的触发时间 IE9 + 及其它都是鼠标选择文本然后释放就会触发但是IE8及以下只要选择了就会触发

取得选择的文本

function getSelectedText(textbox) {
    if (typeof textbox.selectionStart == "number") {
        return textbox.value.substring(textbox.selectionStart,
            textbox.selectionEnd);
    } else if (document.selection) {
        return document.selection.createRange().text;
    }
}

// 显示所选择的文字

function selectText(textbox, startIndex, stopIndex) {
    if (textbox.setSelectionRange) {
        textbox.setSelectionRange(startIndex, stopIndex);
    } else if (textbox.createTextRange) {
        var range = textbox.createTextRange();
        range.collapse(true);
        range.moveStart("character", startIndex);
        range.moveEnd("character", stopIndex - startIndex);
        range.select();
    }
    textbox.focus();
}

var btn = document.getElementById("select-btn");
EventUtil.addHandler(btn, "click", function(event) {
    var textbox = document.forms[0].elements[0];
    selectText(textbox, 4, 7);
});

// HTML５表单required字段
form上 noValidate表单不验证也可以为单个按钮设置 formnovalidate跳过验证

// 获取被选择的项

function getSelectedOptions(selectbox) {
    var result = new Array();
    var option = null;

    for (var i = 0, len = selectbox.options.length; i < len; i++) {
        option = selectbox.options[i];
        if (option.selected) {
            result.push(option);
        }
    }

    return result;
}

// 表单序列化

function serialize(form) {
    var parts = [],
        field = null,
        i,
        len,
        j,
        optLen,
        option,
        optValue;

    for (i = 0, len = form.elements.length; i < len; i++) {
        field = form.elements[i];

        switch (field.type) {
            case "select-one":
            case "select-multiple":

                if (field.name.length) {
                    for (j = 0, optLen = field.options.length; j < optLen; j++) {
                        option = field.options[j];
                        if (option.selected) {
                            optValue = "";
                            if (option.hasAttribute) {
                                optValue = (option.hasAttribute("value") ? option.value : option.text);
                            } else {
                                optValue = (option.attributes["value"].specified ? option.value : option.text);
                            }
                            parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(optValue));
                        }
                    }
                }
                break;

            case undefined: //fieldset
            case "file": //file input
            case "submit": //submit button
            case "reset": //reset button
            case "button": //custom button
                break;

            case "radio": //radio button
            case "checkbox": //checkbox
                if (!field.checked) {
                    break;
                }
                /* falls through */

            default:
                //don't include form fields without names
                if (field.name.length) {
                    parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
                }
        }
    }
    return parts.join("&");
}

// 设置iframe的designMode可以变成可编辑

contenteditable元素设置成可编辑
execCommand可以修改富文本区域的文本
queryCommandEnabled检测是否可以应用某命令比如 execCommand('bold', false, null)等等

// getSelection可以获得选区的文字等等
// 表单中的iframe编辑区或者可编辑元素iframe.document.body.innerHTML元素也一样
IE8不支持 DOM范围但是支持 createRange

// webgl捕获错误需要用gl.getError();

// 目标框架.postMessage(message字符串, 来源站点)向目标iframe传信息，来源站点为包含框架的网页

// 在dragStart中设置dropEffect,over和enter中设置effectAllowed.
setDragImage指定一幅图像当拖动发生时显示在光标下方

// 可以通过canPlayType来确定元素是否支持所播放的视频（音频）格式.加上编码格式才可以比如audio/ogg; codes=\"vorbis\"
html5, pushState必须保证 web server上面也有一个与之相对应的真的 url

try {

} catch (e) {

}

// 错误类型判定
try {
    someFun();
} catch (error) {
    if (error instanceof TypeError) {
        // 处理类型错误
    } else if (error instanceof ReferenceError) {
        // 引用错误
    } else {
        // 其它类型错误
    }
}
throw的时候会让代码立即停止执行

可以自定义错误类型

// 编码url

function addQueryStringArg(url, name, value) {
    if (url.indexOf('?') == -1) {
        url += '?';
    } else {
        url += '&';
    }

    url += encodeURIComponent(name) + '=' + encodeURIComponent(value);

    return url;
}

// 写成模块然后用try { mods[i].init(); } catch (ex) { //这里处理错误 }

// javascript 调试错误集中到服务器

function logError(sev, msg) {
    var img = new Image();
    img.src = 'log.php?sev=' + encodeURIComponent(sev) + '&msg=' + encodeURIComponent(msg);
}

try {

} catch (ex) {
    logError('nofatal', 'module init failed:' + ex.message);
}

// 调试放页面上

function log(message) {
    var console = document.getElementById("debuginfo");
    if (console === null) {
        console = document.createElement("div");
        console.id = "debuginfo";
        console.style.background = "#dedede";
        console.style.border = "1px solid silver";
        console.style.padding = "5px";
        console.style.width = "400px";
        console.style.position = "absolute";
        console.style.right = "0px";
        console.style.top = "0px";
        document.body.appendChild(console);
    }
    console.innerHTML += "<p>" + message + "</p>";
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

// JSON.stringify第二个参数是用于筛选可以用数组包含属性或者用函数来过滤,第三个参数用于设置分隔符
// 可以在json字面量里面定义toJSON当运行的时候会先进行这个
1.运行toJSON2.运行过滤函数3.第三个参数.过滤函数必须按顺序来写可以基于某个属性动态创建属性值比如
var book = {
    "title": "Professional JavaScript",
    "authors": [
        "Nicholas C. Zakas"
    ],
    edition: 3,
    year: 2011,
    releaseDate: new Date(2011, 11, 1)
};

var jsonText = JSON.stringify(book);
alert(jsonText);

var bookCopy = JSON.parse(jsonText, function(key, value) {
    if (key == "releaseDate") {
        return undefined;
    } else {
        return value;
    }
});

// 创建xhr

function createXHR() {
    if (typeof XMLHttpRequest != "undefined") {
        return new XMLHttpRequest();
    } else if (typeof ActiveXObject != "undefined") {
        if (typeof arguments.callee.activeXString != "string") {
            var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0",
                "MSXML2.XMLHttp"
            ],
                i, len;

            for (i = 0, len = versions.length; i < len; i++) {
                try {
                    var xhr = new ActiveXObject(versions[i]);
                    arguments.callee.activeXString = versions[i];
                    return xhr;
                } catch (ex) {
                    //skip
                }
            }
        }

        return new ActiveXObject(arguments.callee.activeXString);
    } else {
        throw new Error("No XHR object available.");
    }
}

xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 //状态码成功
可以在 xhr.open之后和 xhr.send之前设置头 xhr.setRequestHeader("myheader", "myvalue");

// POST
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr1的时候需要加

//XHR2
支持 FormData函数不用加 xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

// ff支持一个overrideMimeType在open之后send之前设置响应的数据类型

// ff,opera,chrome支持load事件和progress事件

// xdr可实现安全可靠的跨域请求,IE要这样写，其它的不用发送的时候用Origin

// Preflighted 请求ie10以前不支持,

function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        xhr = null;
    }
    return xhr;
}

var request = createCORSRequest("get", "http://www.somewhere-else.com/xdr.php");
if (request) {
    request.onload = function() {
        //do something with request.responseText
    };
    request.send();
}

// createStream http流

function createStreamingClient(url, progress, finished) {

    var xhr = new XMLHttpRequest(),
        received = 0;

    xhr.open("get", url, true);
    xhr.onreadystatechange = function() {
        var result;

        if (xhr.readyState == 3) {

            //get only the new data and adjust counter
            result = xhr.responseText.substring(received);
            received += result.length;

            //call the progress callback
            progress(result);

        } else if (xhr.readyState == 4) {
            finished(xhr.responseText);
        }
    };
    xhr.send(null);
    return xhr;
}

var client = createStreamingClient("streaming.php", function(data) {
    alert("Received: " + data);
}, function(data) {
    alert("Done!");
})

// 有一个很重要的功能就是构造函数中创造一个安全的函数

    function Person(name) {
        if (this.instanceof Person) {
            this.name = name;
        } else {
            return new Person(name);
        }
    }

    继承的话必须
subClass.prototype = new superClass();

// 惰性载入函数两种方式

function func() {
    func = function() {

    };

    return func();
}

var func = (function() {
    return function() {

    };
})();

// 

function bind(fn, context) {
    return function() {
        console.log(arguments);
        return fn.apply(context, arguments);
    };
}

var handler = {
    message: "Event handled",

    handleClick: function(event) {
        alert(this.message + ":" + event.type);
    }
};

var btn = document.getElementById("my-btn");
EventUtil.addHandler(btn, "click", bind(handler.handleClick, handler));

// 防止重复执行

function throttle(method, scope) {
    clearTimeout(method.tId);
    method.tId = setTimeout(function() {
        console.log(this);
        method.call(scope);
    }, 100);
}

function resizeDiv() {
    console.log(this);
    var div = document.getElementById("myDiv");
    div.style.height = div.offsetWidth + "px";
}

window.onresize = function() {
    throttle(resizeDiv);
};

var DragDrop = function() {

    var dragdrop = new EventTarget(),
        dragging = null,
        diffX = 0,
        diffY = 0;

    function handleEvent(event) {

        //get event and target
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);

        //determine the type of event
        switch (event.type) {
            case "mousedown":
                if (target.className.indexOf("draggable") > -1) {
                    dragging = target;
                    diffX = event.clientX - target.offsetLeft;
                    diffY = event.clientY - target.offsetTop;
                    dragdrop.fire({
                        type: "dragstart",
                        target: dragging,
                        x: event.clientX,
                        y: event.clientY
                    });
                }
                break;

            case "mousemove":
                if (dragging !== null) {

                    //assign location
                    dragging.style.left = (event.clientX - diffX) + "px";
                    dragging.style.top = (event.clientY - diffY) + "px";

                    //fire custom event
                    dragdrop.fire({
                        type: "drag",
                        target: dragging,
                        x: event.clientX,
                        y: event.clientY
                    });
                }
                break;

            case "mouseup":
                dragdrop.fire({
                    type: "dragend",
                    target: dragging,
                    x: event.clientX,
                    y: event.clientY
                });
                dragging = null;
                break;
        }
    };

    //public interface
    dragdrop.enable = function() {
        EventUtil.addHandler(document, "mousedown", handleEvent);
        EventUtil.addHandler(document, "mousemove", handleEvent);
        EventUtil.addHandler(document, "mouseup", handleEvent);
    };

    dragdrop.disable = function() {
        EventUtil.removeHandler(document, "mousedown", handleEvent);
        EventUtil.removeHandler(document, "mousemove", handleEvent);
        EventUtil.removeHandler(document, "mouseup", handleEvent);
    };

    return dragdrop;
}();

DragDrop.enable();

DragDrop.addHandler("dragstart", function(event) {
    var status = document.getElementById("status");
    status.innerHTML = "Started dragging " + event.target.id;
});

DragDrop.addHandler("drag", function(event) {
    var status = document.getElementById("status");
    status.innerHTML += "<br>Dragged " + event.target.id + " to (" + event.x + "," + event.y + ")";
});

DragDrop.addHandler("dragend", function(event) {
    var status = document.getElementById("status");
    status.innerHTML += "<br>Dropped " + event.target.id + " at (" + event.x + "," + event.y + ")";
});

// IE5.0中可以用style="behavior:url(#default#userData)"来做数据存储
// 记住了要把事件处理程序和应用逻辑分离开来
// 应用逻辑
function validate(value) {
    value = 5 * value;
    if (value >10) {
        document.getElementById('#error-msg').style.display = 'block';
    }
}
// 事件处理程序
function handleKeyPress(event) {
    event =  event;

    validate(value);
}
// 任何事件处理程序都应该处理事件，然后将处理转交给应用逻辑

// 如果当不知道浏览器中是否会有相应的的对象比如getElementsByClassName
应该创建包含所需功能的对象或者创建自定义类型继承需要进行修改的类型
function validate(value) {
    if (!value) {

    }
}
// 定义常量以下划线分开,任何用于显示给用户的字符串都应被抽取出来以方便做国际化
var Constants = {

}

// 使用变量和数组要比访问对象上的属性更有效率

// 后测试循环
比如for (var i = 0; i < 10; i++)换成 for (var i = 10; i >= 0; i--)
// switch语句较快
一旦需要更新考虑用碎片来进行更新
使用事件代理就是在目标元素的父级绑定事件处理程序
// 服务器压缩httpmod_gzip和mod_deflate
// 判断页面是否隐藏
 function isHiddenSupported(){
            return typeof (document.hidden || document.msHidden || document.webkitHidden) != "undefined";
        }    
        
        function handleVisibilityChange(){
            var output = document.getElementById("output"),
                msg;
                
            if (document.hidden || document.msHidden || document.webkitHidden){
                msg = "Page is now hidden." + (new Date()) + "<br>";
            } else {
                msg = "Page is now visible." + (new Date()) + "<br>";
            }
            
            output.innerHTML += msg;
            
        }
// 可以使用web timing来查看结果
window.performance.timing查看性能结果用的
把加解密之类的操作放在worker之中
worker必须在有服务器的情况下运行

// 运用bind函数
if (!Function.prototype.bind) {
    Function.prototype.bind = function(obj) {
        var slice = [].slice,
            args = slice.call(arguments, 1),
            self = this,
            nop = function() {},
            bound = function() {
                return self.apply(this instanceof nop ? this : (obj || {}),
                                        args.concat(slice.call(arguments)));
            };

        nop.prototype = self.prototype;

        bound.prototype = new nop();
        return bound;
    };
}

// bind pattern
// example var one = { name: "mike", say: function(greet) { greet + this.name }}
// var two = { name: "scot" }var twosay = bind(two, one.say);twosay("yo");
function bind(o, m) {
    return function() {
        return m.apply(o, [].slice.call(arguments));
    };
}

