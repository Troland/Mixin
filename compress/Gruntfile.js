module.exports = function(grunt) {
  grunt.initConfig({
    imagemin: {                          // Task
      static: {                          //这里手动写图片
        options: {                       // Target options
          optimizationLevel: 3
        }
      },
      dynamic: {  //动态图片路径
        optimizationLevel: 5,                         
        files: [{
          expand: true,                  // Enable dynamic expansion
          cwd: 'src/',                   // Src matches are relative to this path
          src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
          dest: 'dist/'                  // 发布目录
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.registerTask('default', ['imagemin']);
};