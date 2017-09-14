# myvuemusic

> 音乐

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
1.使用图片懒加载技术优化体验
  <!--fastclik 与 better-scroll冲突， 由于我们在滚动组件需要点击事件，
      而fastclick会阻止默认行为，
      所以要加上needsclick类，让其知道这需要点击-->

2.封装loading组件，优化加载体验

3.封装一个有序的达到需求的map数据结构map｛key，value｝
  3.2把歌手头像通过新建类singer抽象公用方法调用
  class Singer {
    constructor(name, id) {
      this.name = name;
      this.id = id;
    }
4.详情数据抓取
  列表点击跳转到详情页
  定制歌曲详情数据
  使用Vuex管理数据状态
  详情页搭建
5--
使用vuex
  mutations
  actions
  把数据状态统一管理
1.初步理解单一状态树（state）
2.getters--从状态数获取数据源（或依赖其计算数据）
  可在计算属性computed 通过mapGetters混入计算属性
3.Mutations--提交更改state的方式
  可在methods中通过mapMutations 辅助函数混入methods 调用（需要在根节点注入 store），
  这样methods就可以调用更改状态的方法了
4.Actions--批量提交Mutations的方式

7.1
  js动画钩子函数实现播放器动画切换
  使用create-keyframe-animation 模块实现加载动态数据 插入关键帧
7.2 Vuex管理播放播放状态
7.3播放进度条搭建
在播放进度条添加触屏事件、点击事件，派发偏移信息给父组件
本身不参与业务
  利用svg实现圆形播放按钮随进度而改变状态
  创建工具函数util实现洗牌函数，从而当模式改变的时候，播放列表发生相应改变
  当播放列表发生改变的时候要保证当前播放歌曲不发生改变

  实现点击随机播放功能
  注意js slice方法的返回值不改版原来数组，并返回一个新的数组

  使用node服务代理获取歌词接口信息
     处理返回数据是非json格式问题（尽管发送头信息要求回传信息format定义为json）
     使用Base64 npm包转换歌词为字符串
     使用lyric-parser npm包 把歌词 转为指定格式

  使用scroll组件实现歌词滚动
  当歌词行数发生变化处理滚动位置

  实现歌词播放视图和CD视图动画切换
  拖拽进度按钮，歌词跟随变化

  引入minxi公共组件函数
  当各个组件调用相同业务功能时,可以抽取共同模块出来
  解决滚动底部栏腾出问题

  歌单详情页实现
  recommend接口api按原教学中设置，会导致取热门歌单详情会报回掉函数无定义
  需参考原npm jsonp api从新设置

8.通过接收数据扩展排行榜组件
  各个组件的style应该限定作用域，如scrop，只对本组件作用有效，
  否则可能会引起不可测的其它组件导致的冲突

10



