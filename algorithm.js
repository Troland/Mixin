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

// 
