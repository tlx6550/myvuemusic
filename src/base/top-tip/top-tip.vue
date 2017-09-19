<template>
  <transition name="drop">
    <div class="top-tip" v-show="showFlag" @click.stop="hide">
      <slot></slot>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    props:{
      delay:{
        type:Number,
        default:1500
      }
    },
    data(){
      return{
        showFlag:false
      }
    },
    methods:{
      show(){
        // 如果被多次调用，需要清空共用的定时器
        this.showFlag = true
        clearTimeout(this.timer)
        this.timer = setTimeout(()=>{
          this.hide()
        },this.delay)
      },
      hide(){
        this.showFlag = false
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .top-tip
    position: fixed
    top: 0
    width: 100%
    z-index: 500
    background: $color-dialog-background
    &.drop-enter-active, &.drop-leave-active
      transition: all 0.3s
    &.drop-enter, &.drop-leave-to
      transform: translate3d(0, -100%, 0)
</style>
