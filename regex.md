http://regexlib.com/

commentRegExp

    /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg

cjsRequireRegExp

    /[^.]\s*require\s*\(\s*[/']([^'/\s]+)[/']\s*\)/g

isBrowser

    !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && window.document)

isWebWorker

    !isBrowser && typeof importScripts !== 'undefined'

readyRegExp

    isBrowser && navigator.platform === 'PLAYSTATION 3' ? /^complete$/ : /^(complete|loaded)$/

opera

    typeof opera !== 'undefined' && opera.toString() === '[object Opera]'

判断数组元素是否相等

    /\b(.)\1+\b/.test([1,1,1].join(''))

移动手机号码

    /^1(3[4-9]|5[012789]|8[278])\d{8}$/

联通手机号码

    /^1(3[0-2]|5[56]|8[56])\d{8}$/

电信手机号码

    /^(180|189|133|134|153)\d{8}$/

是否是数字包含浮点数

    /^\d*.?\d+$/

正整数 和 0

    /^\d+$/

正整数

    /^[0-9]*[1-9][0-9]*$/

非正整数（负整数 和 0）

    /^((-\d+)|(0+))$/

负整数

    /^-[0-9]*[1-9][0-9]*$/

整数

    /^-?\d+$/

非负浮点数（正浮点数 + 0)

    /^\d+(\.\d+)?$/

正浮点数

    /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/

非正浮点数（负浮点数 + 0）

    /^((-\d+(\.\d+)?)|(0+(\.0+)?))$/

负浮点数

    /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/

浮点数

    /^(-?\d+)(\.\d+)?$/

由26个英文字母组成的字符串

    /^[A-Za-z]+$/

由26个英文字母的大写组成的字符串

    /^[A-Z]+$/

由26个英文字母的小写组成的字符串

    /^[a-z]+$/

由数字和26个英文字母组成的字符串

    /^[A-Za-z0-9]+$/

由数字、26个英文字母或者下划线组成的字符串 非空

    /^\w+$/

url
    /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/

  年-月-日
    /^(d{2}|d{4})-((0([1-9]{1}))|(1[1|2]))-(([0-2]([1-9]{1}))|(3[0|1]))$/

 月/日/年
    /^((0([1-9]{1}))|(1[1|2]))/(([0-2]([1-9]{1}))|(3[0|1]))/(d{2}|d{4})$/

电话号码

    /^((\+?[0-9]{2,4}\-[0-9]{3,4}\-)|([0-9]{3,4}\-))?([0-9]{7,8})(\-[0-9]+)?$/

匹配中文字符的正则表达式

    /[\u4e00-\u9fa5]/


匹配双字节字符(包括汉字在内)

    /[^\x00-\xff]/


匹配空行的正则表达式

    /\n[\s| ]*\r/

匹配国内电话号码

    /(\d{3}-|\d{4}-)?(\d{8}|\d{7})?/


匹配腾讯QQ号

    /^[1-9]*[1-9][0-9]*$/

元字符及其在正则表达式上下文中的行为：

    /{n,m} m 和 n 均为非负整数，其中n .*|/

匹配首尾空格的正则表达式

    /(^s*)|(s*$)/

用正则表达式限制只能输入中文

    onkeyup=/value=value.replace(/[^u4E00-u9FA5]/g,'')/
    onbeforepaste=/clipboardData.setData('text',clipboardData.getData('text').replace(/[^u4E00-u9FA5]/g,''))/

用正则表达式限制只能输入全角字符


    onkeyup=/value=value.replace(/[^uFF00-uFFFF]/g,'')/
    onbeforepaste=/clipboardData.setData('text',clipboardData.getData('text').replace(/[^uFF00-uFFFF]/g,''))/

用正则表达式限制只能输入数字

    onkeyup=/value=value.replace(/[^\d]/g,'') /
    onbeforepaste=/clipboardData.setData('text',clipboardData.getData('text').replace(/[^d]/g,''))/

用正则表达式限制只能输入数字和英文

    onkeyup=/value=value.replace(/[W]/g,'') /
    onbeforepaste=/clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d]/g,''))/

匹配首尾空格的正则表达式

    /(^\s*)|(\s*$)/

 匹配IP地址的正则表达式

  \b(([01]?\d?\d|2[0-4]\d|25[0-5])\.){3}([01]?\d?\d|2[0-4]\d|25[0-5])\b


 sql语句

  /^(select|drop|delete|create|update|insert).*$/

 正浮点数

  /^((0-9)+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/

 非正浮点数

    /^((-\d+\.\d+)?)|(0+(\.0+)?))$/

 负浮点数
    /^(-((正浮点数正则式)))$/

 E-mail地址
    /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/
    /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/

 URL
    /^http[s]*:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^\/\/])*$/

 邮政编码

  /^[1-9]\d{5}$/

 中文

  /^[\u0391-\uFFE5]+$/

 电话号码

  /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/

 手机号码

 /1[3|5|7|8|]\d{9}/

 匹配HTML标记

  /<(S*?)[^>]*>.*?|<.*? />/


 提取信息中的网络链接

  /(h|H)(r|R)(e|E)(f|F) *= *('|/)?(\w|\\|\/|\.)+('|/| *|>)?/

 提取信息中的图片链接

  /(s|S)(r|R)(c|C) *= *('|/)?(\w|\\|\/|\.)+('|/| *|>)?/

 提取信息中的中国手机号码

  /(86)*0*13\d{9}/

 提取信息中的中国固定电话号码

  /(\(\d{3,4}\)|\d{3,4}-|\s)?\d{8}/

 提取信息中的中国电话号码（包括移动和固定电话

  /(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}/

 提取信息中的中国邮政编码

  /[1-9]{1}(\d+){5}/

 提取信息中的浮点数（即小数)

  /(-?\d*)\.?\d+/

 提取信息中的任何数字

  /(-?\d*)(\.\d+)?/

 电话区号

  /^0\d{2,3}$/

帐号(字母开头，允许5-16字节，允许字母数字下划线)

    /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/

中文、英文、数字及下划线

    /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/

空值

    /^$/

非空值

  /./

空格, 或者 空值

  /^\s*$/

非空空格至少一个空格

  /^\s+$/

非空字符

  /\S/

阿拉伯字母不分大小写，非空

  /^[a-z]+$/i

## 匹配数字

- /^\d+$/ 无符号数字
- /^-?\d+$/ 负数或无符号整数
- /^[-+]?\d+$/ 有无符号数字
- /^[-+]?(\d+(\.\d*)?|\.\d+)$/ 浮点数

ZIP码只五位

 /^\d{5}$/

ZIP不止4位

  /^\d{5}-\d{4}$/

ZIP或者ZIP+4码

  /^\d{5}(-\d{4})?$/

ISO日期格式

  /^\d{4}[-\/]\d{2}[-\/]\d{2}$/

MAC Adress
/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/

图片正则表示image/开头然后以jpg,jpeg或者png结尾
/^image\/jpg|jpeg|png|$/

把link中href以/开头的转换为加上域名前缀的但是必须是link
var re = /href=\"([\/].*\.css)\"$/gi
var reJs = /src=\"([\/].*\.js)\"$/gi 替换掉script中以/开头的脚本

```
var s = 'href="/abc/link.css"';
var rs = s.replace(re, 'href="http://www.baidu.com$1');
rs
```

```
var s = 'src="/abc/link.js"';
var rs = s.replace(re, 'src="http://www.baidu.com$1');
rs
```
