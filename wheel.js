function addEvent(el, type, callback, useCapture) {
  if (el.dispatchEvent) {
    el.addEventListener(type, callback, useCapture);
  } else {
    el.attachEvent('on' + type, callback);
  }
  return callback;
}

var wheel = function(obj, callback) {
  var wheelType = 'mousewheel';

  try {
    document.createEvent('MouseScrollEvents');
    wheelType = 'DOMMouseScroll';
  } catch (e) {}
  addEvent(obj, wheelType, function(event) {
    if ('wheelDelta' in event) {
      var delta = event.wheelDelta;

      if (window.opera && opera.version() < 10) {
        delta = -delta;
      }

      event.delta = Math.round(delta) / 120;
    } else if ('detail' in event) {
      event.wheelDelta = -event.detail * 40;
      event.delta = event.wheelDelta / 120;
    }

    callback.call(obj, event);
  });
}
