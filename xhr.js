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

var XMLHttpFactories = [
	function () {return new XMLHttpRequest()},
	function () {return new ActiveXObject("Msxml2.XMLHTTP")},
	function () {return new ActiveXObject("Msxml3.XMLHTTP")},
	function () {return new ActiveXObject("Microsoft.XMLHTTP")}
];

function createXMLHTTPObject() {
	var xmlhttp = false;
	for (var i=0;i<XMLHttpFactories.length;i++) {
		try {
			xmlhttp = XMLHttpFactories[i]();
		}
		catch (e) {
			continue;
		}
		break;
	}
	return xmlhttp;
}

function get(url, options, callback) {
  var xhr = createXMLHTTPObject();

  xhr.onreadystatechange = function (callback) {
    if (xhr.readystate == 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        callback(xhr.responseText);
      }
    } else {
      console.log('Request is unsuccessful' + xhr.status);
    }
  };

  xhr.open('get', url + '?' + serialize(options), true);
  xh.send(null);
}

function post(url, options, callback) {
  var xhr = createXMLHTTPObject();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
  xhr.onreadyStatechange = function (callback) {
    if (xhr.readyState == 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        callback(xhr.responseText);
      }
    } else {
      console.log('Request is unsuccessful' + xhr.status);
    }
  };

  xh.send(serialize(options));
}
