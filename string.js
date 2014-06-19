// 对字符串的操作
function contains(target, it) {
    return target.indexOf(it) != -1;
}

// 判断是否以字符串开头或结尾
function startsWith(target, str, ignorecase) {
    var start_str = target.substr(0, str.length);
    return ignorecase ? start_str.toLowerCase() === str.toLowerCase() :
        start_str === str;
}
function endsWith(target, str, ignorecase) {
    var end_str = target.substr(target.length - str.length);
    return ignorecase ? end_str.toLowerCase() === str.toLowerCase() :
        end_str === str;
}
// 重复生成字符
function repeat(target, n) {
    var s = target, total = '';
    while (n > 0) {
        if (n % 2 == 1) {
            total += s;
        }
        if (n == 1) break;
        s += s;
        n = n >> 1;
    }
    return total;
}
// 字符串长度包含汉字
function byteLen(target) {
    var byteLength = target.length, i = 0;
    for (; i < target.length; i++) {
        if (target.charCodeAt(i) > 255) {
            byteLength++;
        }
    }
    return byteLength;
}
// 可设定保存的汉字的长度fix为汉字长度
function byteLen(target, fix) {
    fix = fix ? fix : 2;
    var str = new Array(fix + 1).join('-');
    return target.replace(/[^\x00-\xff]/g, str).length;
}
// 截取字符
function truncate(target, length, truncation) {
    length = length || 30;
    truncation = truncation == void(0) ? '...' : truncation;
    return target.length > length ?
            target.slice(0, length - truncation.length) + truncation : String(target);
}
// pad数字补0或者其它比如日期
function pad(target, n, filling, right, radix) {
    var num = target.toString(radix || 10);
    filling = filling || '0';
    while (num.length < n) {
        if (!right) {
            num = filling + num;
        } else {
            num += filling;
        }
    }
    return num;
}

// 简单的format
// example: var a = format('Result is #{0} #{1}', 22, 23);
function format(str, object) {
    var array = Array.prototype.slice.call(arguments, 1);
    return str.replace(/\\?\#{([^{}]+)\}/gm, function (match, name) {
        if (match.charAt(0) == '\\') {
            return match.slice(1);
        }
        var index = Number(name);
        if (index >= 0) {
            return array[index];
        }
        if (object && object[name] !== void 0) {
            return object[name];
        }
        return '';
    });
}

// quote方法在字符串两端添加双引号在内部需要转义的地方进行转义