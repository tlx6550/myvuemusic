<template>
  <scroll class="listview"
          :data="data"
          ref="listview"
          :listenScroll="listenScroll"
          @scroll="scroll" :probeType="probeType">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" class="list-group-item">
            <img v-lazy="item.avatar"  class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item,index) in shortcutList"
            class="item"
            :data-index="index"
            :class="{'current':currentIndex === index}"
        >
          {{item}}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getData} from 'common/js/dom'
  // 右侧列表每个元素的高度
  const  ANCHOR_HEIGHT = 18
export default {
  props:{
      data:{
        type:Array,
        default:[]
      }
    },
  created(){
    // 无需观察变化，所以放在这个钩子里面
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    // 当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。
    this.probeType = 3
  },
  data(){
    //需要观察的数据
    return{
      scrollY: -1,
      currentIndex: 0
    }
  },
  methods:{
    onShortcutTouchStart(e){
        let anchorIndex = getData(e.target,'index')
        // 手指刚触碰的位置
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e){
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      // |0相当于向下取整
      let delta = ( this.touch.y2 - this.touch.y1 ) /ANCHOR_HEIGHT | 0
      // 把字符串转为数字
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    scroll(pos){
      // 滚动的y值
      this.scrollY = pos.y
    },
    _scrollTo(index){
      // 原来的组件滚动方法并没有写形参，但是通过apply方法传入arguments可解决
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0)
    },
    _calculateHeight(){
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for(let i = 0;i<list.length; i++){
         let item = list[i];
         height += item.clientHeight
         this.listHeight.push(height)
      }
    }
  },
  computed:{
      shortcutList(){
        let shorcut = []
        this.data.forEach((item)=>{
          shorcut.push(item.title.substr(0,1))
        })
        return shorcut
        //js map() 方法返回一个新数组，回调的group是一个json对象
        //http://www.cnblogs.com/xuan52rock/p/4460949.html
        //或采用以下方法
        /*return this.data.map((group)=>{
          return group.title.substr(0,1)
        })*/
      }
  },
  watch:{
    data(){
      setTimeout(()=>{
        this._calculateHeight()
      },20)
    },
    scrollY(newY){

      const listHeight = this.listHeight
      for(let i = 0;i < listHeight.length;i++){
        let height1 = listHeight[i]
        let height2 = listHeight[i+1]
        if(!height2 || (-newY > height1 && -newY < height2)){
          this.currentIndex = i
          console.log(this.currentIndex)
          return
        }
      }
      this.currentIndex = 0
    }
  },
  components:{
    Scroll
  }
}
</script>
<style lang="stylus" ref="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
