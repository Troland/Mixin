$.fn.transitionEnd = function(callback) {
  __dealCssEvent.call(this, [
    'webkitTransitionEnd', 'transitionend'
  ], callback);
  return this;
};
function __dealCssEvent(eventNameArr, callback) {
  var events = eventNameArr,
    i,
    dom = this; // jshint ignore:line

  function fireCallBack(e) {
    /*jshint validthis:true */
    if (e.target !== this)
      return;
    callback.call(this, e);
    for (i = 0; i < events.length; i++) {
      dom.off(events[i], fireCallBack);
    }
  }
  if (callback) {
    for (i = 0; i < events.length; i++) {
      dom.on(events[i], fireCallBack);
    }
  }
}
