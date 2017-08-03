/*webuploader
https://github.com/fex-team/webuploader/issues/2047
动态设置formData
*/
在uploadBeforeSend中设置
data.a = $('#J_user').val()这样的


// 利用formData
var formData = new FormData($("#J_form")[0]);
console.log(formData)
$.ajax({
  type: "POST",
  url: "/cool-profile",
  data: formData,
  contentType: false,
  processData: false,
  success: function(res) {
    if (res.code === '0') {
      alert('上传成功')
    } else {
      alert('上传错误')
    }
  },
  error: function(XMLHttpRequest, textStatus, errorThrown) {
    alert('上传错误')
  },
  complete: function(xhr, status) {
    alert('上传完成')
  }
});

// 饿了么重新写http-request
<el-upload :http-request="uploadFile" class="upload-demo" ref="upload" action="/profile" name="avatar" :auto-upload="false">
  <el-button slot="trigger" size="small" type="primary">select file</el-button>
  <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">upload to server</el-button>
  <div class="el-upload__tip" slot="tip">jpg/png files with a size less than 500kb</div>
</el-upload>
var V = new Vue({
  el: '#container',
  data: {
    tab: 'tab1',
    m: {
      name: 'nick',
      val: 3
    }
  },
  methods: {
    uploadFile (optioins) {
      var formData = new FormData();
      formData.append('avatar', optioins.file)
      formData.append('username', 'ilovenick')
      $.ajax({
        type: "POST",
        url: "/profile",
        data: formData,
        contentType: false,
        processData: false,
        success: function(res) {
          if (res.code === '0') {
            alert('上传成功')
          } else {
            alert('上传错误')
          }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          alert('上传错误')
        },
        complete: function(xhr, status) {
          alert('上传完成')
        }
      })
    },
    submitUpload() {
      this.$refs.upload.submit();
    }
  },
  components: {}
})
// 饿了么若要传递其它参数
写上:data参数即可



可以接多个上传的图片数组的比如图片组avatar和gallery是两个图片数组
var cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
app.post('/cool-profile', cpUpload, function (req, res, next) {
  // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
  //
  // e.g.
  //  req.files['avatar'][0] -> File
  //  req.files['gallery'] -> Array
  //
  // req.body will contain the text fields, if there were any
  //
  console.log('Uploaded files:', req.files)
  console.log('Text Fields: ', req.body)
  if (req.files) {
    res.status(200).json({
      code: '0',
      result: '上传成功'
    })
  }
})

那个multiple属性是指一次可以上传多个文件即在文件的弹出窗口中选择多个文件

<form name="profile-form" method="post" id="J_form">
  <input type="text" name="username" id="J_user" v-model="m.name">
    <input type="text" name="passwd" v-model="m.val">
      <input type="file" name="avatar" id="avatar">
        <input type="file" name="gallery" multiple id="gallery">
          <input type="submit" value="提交" id="J_submit">
            <div id="uploader" class="wu-example">
              <!--用来存放文件信息-->
              <div id="thelist" class="uploader-list"></div>
              <div class="btns">
                <div id="picker">选择文件</div>
                <button id="ctlBtn" class="btn btn-default">开始上传</button>
              </div>
            </div>
          </form>

$('#J_form').on('submit', function () {
  // new FormData($("#J_form")[0]);
  var formData = new FormData();
  var inputFile = document.getElementById('avatar').files[0]
  var inputFile1 = document.getElementById('gallery').files

  formData.append('avatar', inputFile)
  for (var i = 0; i < inputFile1.length; i++) {
    formData.append('gallery', inputFile1[i])
  }
  //
  formData.append('username', 'mark')
  console.log(inputFile, inputFile1)
  $.ajax({
    type: "POST",
    url: "/cool-profile",
    data: formData,
    contentType: false,
    processData: false,
    success: function(res) {
      if (res.code === '0') {
        alert('上传成功')
      } else {
        alert('上传错误')
      }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      alert('上传错误')
    },
    complete: function(xhr, status) {
      alert('上传完成')
    }
  });
  alert('goood')
  return false
})

// fileApI
<input type="file" id="fileElem" multiple accept="image/*" style="display:none" onchange="handleFiles(this.files)">
  <label for="fileElem">Select some files</label>
  <div id="preview"></div>
  function handleFiles(files) {
    var preview = document.getElementById('preview');
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var imageType = /^image\/jpg$/;

      if (!imageType.test(file.type)) {
          continue;
      }

      var img = document.createElement("img");
      img.classList.add("obj");
      img.file = file;
      preview.appendChild(img); // Assuming that "preview" is the div output where the content will be displayed.

      var reader = new FileReader();
      reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
      reader.readAsDataURL(file);
    }
  }
