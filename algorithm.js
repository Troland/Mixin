// sort
systemSort: function (array) {
    return array.sort(function(a, b){
            return a - b;
        });
};

// bubble sort
function bubbleSort(array) {
      var i = 0, len = array.length,
            j, d;
        for(; i<len; i++){
            for(j=i; j<len; j++){
                if(array[i] > array[j]){
                    d = array[j];
                    array[j] = array[i];
                    array[i] = d;
                }
            }
        }
        return array;
}

//binary search
​function binarySearch(arr, start, end, dst) {
  // 判断是否只剩下最后两个数字
  if ((end - start) == 1) {
    if (arr[start] == dst) {
      return start;
    }
    if (arr[end] == dst) {
      return end;
    }
    return -1;
  }
  var center =  Math.floor((start + end) / 2);
  if (dst != arr[center]) {
    return arr[center] > dst ? binarySearch(arr, start, center, dst) :
      binarySearch(arr, center, end, dst);
  }
}


// 将递归执行转为循环执行
function trampoline(f) {
  while (f && f instanceof Function) {
    f = f();
  }
  return f;
}
// problem
// 未和
function sum(x, y) {
  if (y > 0) {
    return sum(x + 1, y - 1);
  } else {
    return x;
  }
}

sum(1, 100000)
// Uncaught RangeError: Maximum call stack size exceeded(…)
// 改写
function sum(x, y) {
  if (y > 0) {
    return sum.bind(null, x + 1, y - 1);
  } else {
    return x;
  }
}
trampoline(sum(1, 100000))
