<template>
<div class="progress-circle">
  <svg :width="radius" :height="radius" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent" />
    <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"/>
  </svg>
  <slot></slot>
</div>
</template>
<!--关于stroke
http://www.zhangxinxu.com/wordpress/2014/04/animateion-line-drawing-svg-path-%E5%8A%A8%E7%94%BB-%E8%B7%AF%E5%BE%84/-->
<script type="text/ecmascript-6">
export default {
  props:{
    radius:{
      type:Number,
      default:100
    },
    percent:{
      type:Number,
      default:0
    }
  },
  data(){
    return{
      // 圆圈周长
      dashArray:2 * Math.PI * 50
    }
  },
  computed:{
    // 偏移量
    dashOffset(){
      return (1 - this.percent) * this.dashArray
    }
  }
}
</script>
<style lang="stylus" ref="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-circle
    position: relative
    circle
      stroke-width: 8px
      transform-origin: center
      &.progress-background
        transform: scale(0.9)
        stroke: $color-theme-d
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)
        stroke: $color-theme
</style>
