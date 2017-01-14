##浏览器重置文件
reset是最早的没有用box-sizing,如果要兼容ie6+就用这个
_h5doctor是用了那个box-sizing，ie6,8不支持

normalize_compatible:兼容ie6+
normalize兼容 ie8+

*在移动项目中用normalize
桌面项目看情况如果设计得仔细就用reset吧,如果可以自由发挥就normalize，如果用normalize就得再加上一个全局的base设定比如全局设定h1等*

但是如果所有页面都有一个公共的CSS可提取出来比如写上global.scss里面import上base.scss, type.scss等等,然后index.scss再import其它的样式即可
如果是spa就在外面写个main.scss把全部包进去，如果是多页就在外面写上home.scss然后把所有的都包进去

normalize和reset的区别：reset是全部置0犹如白纸，normalize是让所有浏览器表现一致[cssreset和nomalize区别](https://www.zhihu.com/question/23554164)
