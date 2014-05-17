(function() {
    function draw(timestamp) {
        // 计算两次重绘的时间间隔
        var drawStart = (timestamp || Date.now()),
            diff = drawStart - startTime;

        // 使用diff确定下一步重绘时间
        // 把startTime重写为这一次的绘制时间
        startTime = drawStart;

        // 重绘UI
        requestAnimationFrame(draw);
    }

    var requestAnimationFrame = window.requestAnimationFrame ||
                                                window.mozRequestAnimationFrame ||
                                                window.webkitRequestAnimationFrame ||
                                                window.msRequestAnimationFrame,
        startTime = window.mozAnimationStartTime || Date.now();

    requestAnimationFrame(draw);
});