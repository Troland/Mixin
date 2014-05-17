/**
 * 汉诺塔移动盘子在三个地方，每次只允许移一个，且小盘子永远在上方
 * @param  {[int]} disc
 * @param  {[string]} src
 * @param  {[string]} aux
 * @param  {[string]} dst
 * @return null
 */
var hanoi = function(disc, src, aux, dst) {
    if (disc > 0) {
        hanoi(disc - 1, src, dst, aux);
        console.log("Move disc " + disc +
                    " from " + src + " to " + dst);
        hanoi(disc - 1, aux, src, dst);
    }
};

// usage:hanoi(3, "Src", "Aux", "Dst");

// factorial function 阶乘
var factorial = function(i, a) {
    a = a || 1;
    if (i < 2) {
        return a;
    }
    return factorial(i - 1, a * i);
};
// 数是前两个数的总和
var fibonacci = (function() {
    var memo = [0, 1];
    var fib = function(n) {
        var result = memo[n];
        if (typeof result !== "number") {
            result = fib(n - 1) + fib(n - 2);
            memo[n] = result;
        }

        return result;
    };
    return fib;
}());



