function serialize(data) {
  if (!data) return '';
  var paris = [];
  for (var prop in data) {
    if (!data.hasOwnProperty(prop) || (typeof (data[prop]) == 'function')) continue;
    var value = data[prop].toString();
    prop = encodeURIComponent(prop);
    paris.push(prop + '=' + value);
  }
  return paris.join('&');
}
