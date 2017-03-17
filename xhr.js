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

function sendAjax() {
  //构造表单数据
  var formData = new FormData();
  formData.append('username', 'johndoe');
  formData.append('id', 123456);
  //创建xhr对象
  var xhr = new XMLHttpRequest();
  //设置xhr请求的超时时间
  xhr.timeout = 3000;
  //设置响应返回的数据格式
  xhr.responseType = "text";
  //创建一个 post 请求，采用异步
  xhr.open('POST', '/server', true);
  //注册相关事件回调处理函数
  xhr.onload = function(e) {
    if(this.status == 200||this.status == 304){
        alert(this.responseText);
    }
  };
  xhr.ontimeout = function(e) { ... };
  xhr.onerror = function(e) { ... };
  xhr.upload.onprogress = function(e) { ... };

  //发送数据
  xhr.send(formData);
}
