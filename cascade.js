function cascade(selectList, data) {
  // 这里selectList为依次级联的选择器元素列表，如[select1,select2,select3,...]
  var i;
  for (i = 0; i < selectList.length; i++) {
    selectList.onchange = function (e) {

    }
  }
}
