// addClass
function addClass(el) {
  if (el.classList) {
    el.classList.add(className);
  } else {
    el.className += ' ' + className;
  }
}

// 在元素的后面添加html字符串
function insertHtmlAfterNode(el, htmlString) {
  el.insertAdjacentHTML('afterend', htmlString);
}

function prependNode(parent, el) {
  parent.insertBefore(el, parent.firstChild);
}


// 在元素的前面添加html字符串
function insertHtmlBeforeDom(el, htmlString) {
  el.insertAdjacentHTML('beforebegin', htmlString);
}

function cloneNode(el) {
  return el.cloneNode(true);
}

// el是否包含指定的子元素
function isContainNode(el, child) {
  return el !== child && el.contains(child);
}

// 遍历元素
function traverseNodes(selector, cb) {
  var elements = document.querySelectorAll(selector);
  Array.prototype.forEach.call(elements, function(el, i){
    cb(el, i);
  });
}

function filterNodes(selector, filterFn) {
  return Array.prototype.filter.call(document.querySelectorAll(selector), filterFn);
}

function hasClass(el, className) {
  if (el.classList) {
    return el.classList.contains(className);
  } else {
    return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
  }
}

function matchNode(el, selector) {
  return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
}

// 获得元素的整个内容包含其自身
$dom.outerHTML
// 获得属性值
getComputedStyle(el)[ruleName]
// 下一个元素
el.nextElementSibling

function functionName() {

}

// 获得元素在页面上的位置相当于 jQuery 的 $(el).offset()
function getOffset(el) {
  var rect = el.getBoundingClientRect();
  return {
    top: rect.top + document.body.scrollTop,
    left: rect.left + document.body.scrollLeft
  }
}

// 获得元素离最近定位的元素的距离
function getPosition(el) {
  return {
    left: el.offsetLeft,
    top: el.offsetTop
  }
}

// 获取元素的高度
function outerHeight(el, withMargin) {
  var height = el.offsetHeight;
  var style = el.currentStyle || getComputedStyle(el);

  if (withMargin) {
    height += parseInt(style.marginTop) + parseInt(style.marginBottom);
  }

  return height;
}

// 获取元素的宽度
function outerWidth(el, withMargin) {
  var width = el.offsetWidth;
  var style = el.currentStyle || getComputedStyle(el);

  if (withMargin) {
    width += parseInt(style.marginLeft) + parseInt(style.marginRight);
  }

  return width;
}


el.offsetParent || el

function removeClass(el) {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
}

function getSiblings(el) {
  return Array.prototype.filter.call(el.parentNode.children, function(child){
    return child !== el;
  });
}

function toggleClass(el, className) {
  if (el.classList) {
    el.classList.toggle(className);
  } else {
    var classes = el.className.split(' ');
    var existingIndex = classes.indexOf(className);

    if (existingIndex >= 0)
      classes.splice(existingIndex, 1);
    else
      classes.push(className);

    el.className = classes.join(' ');
  }
}

function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

// 找出元素在父元素中的索引
function indexInParent(node) {
    var children = node.parentNode.childNodes;
    var num = 0;
    for (var i=0; i<children.length; i++) {
         if (children[i]==node) return num;
         if (children[i].nodeType==1) num++;
    }
    return -1;
}

// 寻找元素最近的指定的类的父元素
function closest(el, selector) {
  var matchesFn;

  // find vendor prefix
  ['matches','webkitMatchesSelector','mozMatchesSelector','msMatchesSelector','oMatchesSelector'].some(function(fn) {
      if (typeof document.body[fn] == 'function') {
          matchesFn = fn;
          return true;
      }
      return false;
  })

  var parent;

  // traverse parents
  while (el) {
      parent = el.parentElement;
      if (parent && parent[matchesFn](selector)) {
          return parent;
      }
      el = parent;
  }

  return null;
}
