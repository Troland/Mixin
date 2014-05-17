// 算法循环迭代算法当只有在大数据集的时候有用
var iterations = Math.ceil(values.length / 8);
var startAt = values.length % 8;
var i = 0;

do {
    switch(startAt) {
        case 0: process(values[i++]);
        case 7: process(values[i++]);
        case 6: process(values[i++]);
        case 5: process(values[i++]);
        case 4: process(values[i++]);
        case 3: process(values[i++]);
        case 2: process(values[i++]);
        case 1: process(values[i++]);
    }

    startAt = 0;
} while (--iterations > 0);


// 另一更快算法
var iterations = Math.floor(values.length / 8);
var leftover = values.length % 8;
var i =0;

if (leftover > 0) {
    do {
        process(values[i++]);
    } while (--leftover > 0);
}
do {
    process(values[i++]);
    process(values[i++]);
    process(values[i++]);
    process(values[i++]);
    process(values[i++]);
    process(values[i++]);
    process(values[i++]);
    process(values[i++]);
} while (--iterations > 0);