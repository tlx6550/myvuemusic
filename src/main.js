import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import fastclick from 'fastclick'
import router from './router'
import store from './srore'
// 等价于
// import store from './srore/index'
import 'common/stylus/index.styl'
import VueLazyLoad from 'vue-lazyload'

// import变量，但是没使用，所以定义如下，规避eslin语法检查
/* eslint-disable no-unused-vars */
import vConsole from 'vconsole'
// 这样在手机端就可以查看控制台的信息了
console.log('text')
/* 解决移动端300毫秒延迟问题 */
fastclick.attach(document.body)
Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png')
})
Vue.config.productionTip = false
/*周期详解vue生命
http://www.cnblogs.com/emma0118/p/6660004.html*/
/* render: h => h(App)
   render函数是渲染一个视图，然后提供给el挂载
   等价于
  render: h => {
    return h(App)
} */
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store ,
  render: h => h(App)
})
