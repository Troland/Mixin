把数字转换成英文，要考虑小数。比如12.34输出是Twelve and 34/100
刷Leetcode题
function statistics(arr) {
  var result = [
    {
      skill: 'javascript', user: [], count: 0
    },
    {
      skill: 'html', user: [], count: 0
    },
    {
      skill: 'css', user: [], count: 0
    }
  ];
  for (var i = 0; i < arr.length; i++) {
    var item = arr[i];
    switch (item.skill) {
      case 'javascript':
        result[0].user.push(item.user);
        result[0].count++;
        break;
      case 'css':
        result[1].user.push(item.user);
        result[1].count++;
        break;
      case 'html':
        result[2].user.push(item.user);
        result[2].count++;
        break;
    }
  }
}


计算器里面的redo和undo功能设计

// function output
[
  { skill: 'javascript', user: [ 'Chad', 'Bill', 'Sue' ], count: 3 },
  { skill: 'css', user: [ 'Sue', 'Bill' ], count: 2 },
  { skill: 'html', user: [ 'Sue' ], count: 1 }
];

一个tooltip hover上去显示详情
var endorsements = [
  { skill: 'javascript', user: 'Chad' },
  { skill: 'javascript', user: 'Bill' },
  { skill: 'javascript', user: 'Sue' },
  { skill: 'html', user: 'Sue' },
  { skill: 'css', user: 'Sue' },
  { skill: 'css', user: 'Bill' }
];


不会啦冒泡及如何使用
sass的优缺点

利用fragment把节点插入到div之路就不会造成reflow
记忆函数利用hashTable存储之前的结果
