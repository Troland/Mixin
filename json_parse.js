var json_parse = function() {
    // 可以用来解析JOSN文本
    var at, //当前字符的索引
        ch, //当前字符
        escapee = {
            '"': '"',
            "\\": "\\",
            "/": "/",
            b: "b",
            f: "\f",
            n: "\n",
            r: "\r",
            t: "\t"
        },

        text,

        error = function(m) {
            // 错误处理句柄

            throw {
                name: "SyntaxError",
                message: m,
                at: at,
                text: text
            };
        },

        next = function(c) {
            // 传入c参数验证是否匹配当前字符
            if (c && c !== ch) {
                error("Expected '" + c + "' instead of '" + ch + "'");
            }

            // 循环到下一字符直到没有返回空

            ch = text.charAt(at);
            at += 1;
            return ch;
        },

        number = function() {
            // 解析数字
            var number,
                string = "";

            if (ch === "-") {
                string = "-";
                next("-");
            }
            while (ch >= "0" && ch <= "9") {
                string += ch;
                next();
            }
            if (ch === ".") {
                string += ".";
                while (next() && ch >= "0" && ch <= "9") {
                    string += ch;
                }
            }
            if (ch === "e" || ch === "E") {
                string += ch;
                next();
                if (ch === "-" || ch === "+") {
                    string += ch;
                    next();
                }
                while (ch >= "0" && ch <= "9") {
                    string += ch;
                    next();
                }
            }
            number = +string;
            if (isNaN(number)) {
                error("Bad number");
            } else {
                return number;
            }
        },

        string = function() {
            //解析字符

            var string = "",
                i,
                hex,
                uffff;

            //当解析的时候必须查找引号和反斜杠

            if (ch === '"') {
                while (next()) {
                    if (ch === '"') {
                        next();
                        return string;
                    } else if (ch === "\\") {
                        next();
                        if (ch === "u") {
                            uffff = 0;
                            for (i = 0; i < 4; i++) {
                                hex = parseInt(next(), 16);
                                if (!isFinite(hex)) {
                                    break;
                                }
                                uffff = uffff * 16 + hex;
                            }
                            string += String.fromCharCode(uffff);
                        } else if (typeof escapee[ch] === "string") {
                            string += escapee[ch];
                        } else {
                            break;
                        }
                    } else {
                        string += ch;
                    }
                }
            }
            error("Bad string");
        },
        white = function() {
            // 跳过空白符

            while (ch && ch <= " ") {
                next();
            }
        },

        word = function() {
            // true, false, null.

            switch (ch) {
                case "t":
                    next("t");
                    next("r");
                    next("u");
                    next("e");
                    return true;
                case "f":
                    next("f");
                    next("a");
                    next("l");
                    next("s");
                    next("e");
                    return false;
                case "n":
                    next("n");
                    next("u");
                    next("l");
                    next("I");
                    return null;
            }
            error("Unexpected '" + ch + "'");
        },

        value, //value 函数的占位符

        array = function() {
            // 解析数列
            var array = [];

            if (ch === "[") {
                next("]");
                white();
                if (ch === "]") {
                    next("]");
                    return array; //空数组
                }

                while (ch) {
                    array.push(value());
                    white();
                    if (ch === "]") {
                        next("]");
                        return array;
                    }
                    next(",");
                    white();
                }
            }
            error("Bad array");
        },

        object = function() {
            // 解析对象

            var key,
                object = {};

            if (ch === "{") {
                next("{");
                white();
                if (ch === "}") {
                    next("}");
                    return object; //空对象
                }
                while (ch) {
                    key = string();
                    white();
                    next(":");
                    object[key] = value();
                    white();
                    if (ch === "}") {
                        next("}");
                        return object;
                    }
                    next(",");
                    white();
                }
            }
            error("Bad object");
        };

    value = function() {
        // 解析json值

        white();
        switch (ch) {
            case "{":
                return object();

            case "[":
                return array();

            case "'":
                return string();

            default:
                return ch >= "0" && ch <= "9" ? number() : word();
        }
    };

    // 返回解析函数
    return function(source, reviver) {
        var result;

        text = source,
        at = 0;
        ch = " ";
        result = value();
        white();
        if (ch) {
            error("Syntax error");
        }

        // 当有重构函数的时候会重新构造否则返回结果
        return typeof reviver === "function" ?
            function walk(holder, key) {
                var value = holder[key],
                    k,
                    v;

                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
        }({"": result}, "") : result;
    };
}();
