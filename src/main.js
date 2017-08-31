import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import fastclick from 'fastclick'
import router from './router'
import 'common/stylus/index.styl'
/* 解决移动端300毫秒延迟问题 */
fastclick.attach(document.body)

Vue.config.productionTip = false
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
  render: h => h(App)
})
