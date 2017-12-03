// written by Dean Edwards, 2005
// with input from Tino Zijdel, Matthias Miller, Diego Perini

// http://dean.edwards.name/weblog/2005/10/add-event/

function addEvent(element, type, handler) {
  if (element.addEventListener) {
    element.addEventListener(type, handler, false);
  } else {
    // assign each event handler a unique ID
    if (!handler.$$guid)
      handler.$$guid = addEvent.guid++;

    // create a hash table of event types for the element
    if (!element.events)
      element.events = {};

    // create a hash table of event handlers for each element/event pair
    var handlers = element.events[type];
    if (!handlers) {
      handlers = element.events[type] = {};
      // store the existing event handler (if there is one)
      if (element["on" + type]) {
        handlers[0] = element["on" + type];
      }
    }
    // store the event handler in the hash table
    handlers[handler.$$guid] = handler;
    // assign a global event handler to do all the work
    element["on" + type] = handleEvent;
  }
};
// a counter used to create unique IDs
addEvent.guid = 1;

function removeEvent(element, type, handler) {
  if (element.removeEventListener) {
    element.removeEventListener(type, handler, false);
  } else {
    // delete the event handler from the hash table
    if (element.events && element.events[type]) {
      delete element.events[type][handler.$$guid];
    }
  }
};

function handleEvent(event) {
  var returnValue = true;
  // grab the event object (IE uses a global event object)
  event = event || fixEvent(((this.ownerDocument || this.document || this).parentWindow || window).event);
  // get a reference to the hash table of event handlers
  var handlers = this.events[event.type];
  // execute each event handler
  for (var i in handlers) {
    this.$$handleEvent = handlers[i];
    if (this.$$handleEvent(event) === false) {
      returnValue = false;
    }
  }
  return returnValue;
};

function fixEvent(event) {
  // add W3C standard event methods
  event.preventDefault = fixEvent.preventDefault;
  event.stopPropagation = fixEvent.stopPropagation;
  return event;
};
fixEvent.preventDefault = function() {
  this.returnValue = false;
};
fixEvent.stopPropagation = function() {
  this.cancelBubble = true;
};

// 1) 使用独立的作用域包含声明
var addEvent = (function() {
  var docEl = document.documentElement;

  // 2) 声明要引用函数的变量
  var fn;
  if (docEl.addEventListener) {
    // 3) 有意给函数一个描述性的标识符
    fn = function addEvent(element, eventName, callback) {
      element.addEventListener(eventName, callback, false);
    }
  } else if (docEl.attachEvent) {
    fn = function addEvent(element, eventName, callback) {
      element.attachEvent('on' + eventName, callback);
    }
  } else {
    fn = function addEvent(element, eventName, callback) {
      element['on' + eventName] = callback;
    }
  }
  // 4) 清除由JScript创建的addEvent函数
  //    一定要保证在赋值前使用var关键字
  //    除非函数顶部已经声明了addEvent
  var addEvent = null;
  // 5) 最后返回由fn引用的函数
  return fn;
})();

// trigger event 类似于 $(el).trigger('my-event', {some: 'data'});
// 原生事件如 click 不传参数
// 当不是原生的时候示例如下：
// el.addEventListener('click3', function(e) {
//    console.log('Event:', e);
//    console.log('Params:', e.detail); 参数会写在 e.detail 中
// })
// trigger('click3', el, false, {name: 'nick'});
function trigger(eventType, el, isNative, data) {
  isNative = (isNative !== undefined) ? isNative : true;

  if (isNative) {
    var event = document.createEvent('HTMLEvents');
    event.initEvent(eventType, true, false);
  } else {
    if (window.CustomEvent) {
      var event = new CustomEvent(eventType, {detail: data});
    } else {
      var event = document.createEvent('CustomEvent');
      event.initCustomEvent(eventType, true, true, data);
    }
  }

  el.dispatchEvent(event);
}
