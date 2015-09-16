IE9以下不支持数组indexOf
img onerror IE下Stack overflow at line: 0错误是由于onerror的图片也不存在引起的.
onerror="this.onerror='';this.src='/Images/img/error-car.png'"来解决.
IE7上的a href会自动加上域名. href = $(this).attr('href').replace(/.*(?=#[^\s]*$)/, ''), //strip for ie7
关于tbodyIE8在创建table的时候ie6,7会