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
