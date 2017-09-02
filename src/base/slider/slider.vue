<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item,index) in dots" :class="{active:currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {addClass} from 'common/js/dom'
  export default {
    data() {
      return {
        dots: [],
        // children: [],
        currentPageIndex: 0
      }
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    mounted() {
      setTimeout(() => {
        // 执行顺序有先后
        this._setSliderWidth()
        this._initDots()
        this._initSlider()
        if(this.autoPlay){
          this._play()
        }
      }, 20)
      // 窗口发生改变时，要重新计算轮播大小
      window.addEventListener('resize',() =>{
        if(!this.slider){
          return
        }
        this._setSliderWidth(true)
        this.slider.refresh()
      })
    },
    methods: {
      _setSliderWidth(isResize) {
        // children是vuejs里 的特有dom属性
        this.children = this.$refs.sliderGroup.children
        let width = 0
        // dom元素的属性
        let sliderWidth = this.$refs.slider.clientWidth
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item')
          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }
        if (this.loop && !isResize) {
          // 无缝滚动时候左右两边各克隆一个dom
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initSlider() {
        // 滑动用法https://ustbhuangyi.github.io/better-scroll/doc/options.html#tap
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400
        })
        this.slider.on('scrollEnd', ()=> {
         let pageIndex = this.slider.getCurrentPage().pageX
         if(this.loop){
           // 无缝滚动要减去头自动添加的一个dom个数
           pageIndex -= 1
         }
         this.currentPageIndex = pageIndex
         if(this.autoPlay){
           clearTimeout(this.timer)
           this._play()
         }
       })
      },
      _initDots() {
         this.dots = new Array(this.children.length)
      },
      _play(){
        let pageIndex = this.currentPageIndex + 1
        if(this.loop) {
          pageIndex += 1
        }
       this.timer = setTimeout(()=>{
          this.slider.goToPage(pageIndex,0,400)
       },this.interval)
      }
    },
    destroyed() {
      clearTimeout(this.timer)
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
