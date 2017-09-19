<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtittle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
           <!-- 单独显示当前歌词行-->
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p class="text"
                   :class="{'current': currentLineNum ===index}"
                   ref="lyricLine"
                   v-for="(line,index) in currentLyric.lines">{{line.txt}}
                </p>
              </div>
            </div>
          </scroll>
        </div>
      <div class="bottom">
        <div class="dot-wrapper">
          <span class="dot" :class="{'active':currentShow === 'cd'}"></span>
          <span class="dot" :class="{'active':currentShow === 'lyric'}"></span>
        </div>
        <div class="progress-wrapper">
          <span class="time time-l">{{format(currentTime)}}</span>
          <div class="progress-bar-wrapper">
            <progress-bar @percentChange="onProgreesBarChange" :percent="percent"></progress-bar>
          </div>
          <span class="time time-r">{{format(currentSong.duration)}}</span>
        </div>
        <div class="operators">
          <div class="icon i-left" @click="changeMode">
            <i :class="iconMode"></i>
          </div>
          <div class="icon i-left"  :class="disableCls">
            <i @click="prev" class="icon-prev"></i>
          </div>
          <div class="icon i-center"  :class="disableCls">
            <i @click="togglePlaying" :class="playIcon"></i>
          </div>
          <div class="icon i-right"  :class="disableCls">
            <i @click="next" class="icon-next"></i>
          </div>
          <div class="icon i-right">
            <i class="icon icon-not-favorite" ></i>
          </div>
        </div>
      </div>
    </div>
    </transition>
    <transition name="mini">
       <div class="mini-player" v-show="!fullScreen" @click="open">
      <div class="icon">
        <img :class="cdCls" width="40" height="40" :src="currentSong.image">
      </div>
      <div class="text">
        <h2 class="name" v-html="currentSong.name"></h2>
        <p class="desc" v-html="currentSong.singer"></p>
      </div>
      <div class="control">
        <progress-circle :radius="radius" :percent="percent">
          <!--阻止事件冒泡-->
          <i @click.stop="togglePlaying" class="icon-mini" :class="minIcon"></i>
        </progress-circle>
      </div>
      <div class="control" @click.stop="showPlaylist">
        <i class="icon-playlist"></i>
      </div>
    </div>
    </transition>
    <playlist ref="playlist"></playlist>
    <audio @timeupdate="updateTime" @canplay="ready" @error="error" ref="audio" @ended="end" :src="currentSong.url"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters,mapMutations,mapActions} from 'vuex'
  // 创建关键帧动画脚本
  import animations from 'create-keyframe-animation'
  import ProgressBar from 'base/progress-bar/progress-bar'
  import ProgressCircle from 'base/progress-circle/progress-circle'
  import {prefixStyle} from 'common/js/dom'
  import {playMode} from 'common/js/config'
  import {playerMixin} from 'common/js/mixin'
  // import {shuffle} from 'common/js/util'
  import Scroll from 'base/scroll/scroll'
  import Playlist from 'components/playlist/playlist'
  // 把歌词字符串转为制定格式
  import Lyric from 'lyric-parser'
  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')
  export default {
    mixins:[playerMixin],
    data(){
     return {
       songReady:false,
       // 歌曲当前时间
       // 接口文档http://www.runoob.com/tags/ref-av-dom.html
       currentTime:0,
       radius:32,
       currentLyric:null,
       // 当前歌词所在行
       currentLineNum:0,
       // 当前播放视图
       currentShow:'cd',
       // 单独歌词行
       playingLyric:''
     }
    },
    computed:{
      // mapGetters 辅助函数仅仅是将 store 中的 getters 映射到局部计算属性：
      ...mapGetters([
        'fullScreen',
        'playing',
        'currentIndex'/*,
        'playlist',
        'currentSong',
        'mode',
        'sequenceList'*/
      ]),
      playIcon(){
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      minIcon(){
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      cdCls(){
        return this.playing ? 'play' : 'play pause'
      },
      disableCls(){
        return this.songReady ? '' : 'disable'
      },
      percent(){
        return this.currentTime / this.currentSong.duration
      }/*,
      转移到mixin
      iconMode(){
        return this.mode === playMode.sequence ? 'icon-sequence': this.mode === playMode.loop ?  'icon-loop' : 'icon-random'
      }*/
    },
    created(){
      this.touch = {}
    },
    methods:{
      back(){
        this.setFullScreen(false)
      },
      ...mapMutations({
        setFullScreen:'SET_FULL_SCREEN'/*,
        setPlayingState:'SET_PLAYING_STATE',
        setCurrentIndex:'SET_CURRENT_INDEX',
        setPlayMode:'SET_PLALY_MODE',
        setPlayList:'SET_PLAYLIST'*/
      }),
      ...mapActions([
        'savePlayHistory'
      ]),
      open(){
        this.setFullScreen(true)
      },
      showPlaylist(){
        this.$refs.playlist.show()
      },
      enter(el,done){
        const {x,y,scale} = this._getPosAndScale()
        let animation = {
          0:{
            transform:`translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60:{
            transform:`translate3d(0,0,0) scale(1.1)`
          },
          100:{
            transform:`translate3d(0,0,0) scale(1)`
          }
        }
        animations.registerAnimation({
          name:'move',
          animation,
          presets:{
            duration: 400, // 持续时间
            easing: 'linear', // 动画的效果 default easing
          }
        })
        // 作用的dom
        animations.runAnimation(this.$refs.cdWrapper,'move',done)
      },
      afterEnter() {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el, done) {
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        const {x, y, scale} = this._getPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave() {
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style[transform] = ''
      },
      // 获取动画元素位置信息缩放信息
      _getPosAndScale(){
       // 左下角图标信息
        const targetWidth = 40
        const paddingLeft = 40
        const paddingBottom = 30
      //  唱片图片信息
        const paddingTop = 80
        const width = window.innerWidth * 0.8
        const scale = targetWidth / width
        const x = -(window.innerWidth / 2 -paddingLeft)
        const y = window.innerHeight - paddingTop - width / 2 -paddingTop -paddingBottom
        return{
          x,y,scale
        }
      },
      togglePlaying(){
        if(!this.songReady){
          return
        }
        // this.playing计算属性
        this.setPlayingState(!this.playing)
        // 解决当暂停播放时候，歌词还会继续走
        if(this.currentLyric){
          this.currentLyric.togglePlay()
        }
      },
      next(){
        // 歌曲状态还没准备好
        if( !this.songReady){
          return
        }
        // 当歌手歌曲只有一首
        if(this.playlist.length === 1){
          this.loop()
        }else {
          let index = this.currentIndex + 1
          if(index === this.playlist.length){
            index = 0
          }
          this.setCurrentIndex(index)
          if(!this.playing){
            this.togglePlaying()
          }
        }

        // 点击后 重置为false
        this.songReady = false
      },
      prev(){
        if( !this.songReady){
          return
        }
        if(this.playlist.length === 1){
          this.loop()
        }else {
          let index = this.currentIndex - 1
          if(index === -1){
            index = this.playlist.length -1
          }
          this.setCurrentIndex(index)
          if(!this.playing){
            this.togglePlaying()
          }
        }

        this.songReady = false
      },
      ready(){
        this.songReady = true
        // 提交actions
        this.savePlayHistory(this.currentSong)
      },
      // 当出现网络异常等情况
      error(){
        this.songReady = true
      },
      updateTime(e){
        this.currentTime = e.target.currentTime
      },
      //时间格式hua
      format(interval){
        //interval为秒数 | 0 向下取整,相当于Math.floor()
        interval = interval | 0 ;
        const minute = interval / 60 | 0
        const second = this._pad(interval % 60)
        return `${minute}:${second}`
      },
      // 位数补齐
      _pad(num , n = 2){
        let len = num.toString().length
        while  (len < n){
          num = '0' + num
          len++
        }
        return num
      },
      onProgreesBarChange(percent){
        const currentTime = this.currentSong.duration * percent
        this.$refs.audio.currentTime = currentTime
        // 假如拖动的时候是暂停，则拖动后播放
        if(!this.playing){
          this.togglePlaying()
        }
        // 拖拽按钮位置变化，歌词跟随变化
        if(this.currentLyric){
          this.currentLyric.seek(currentTime * 1000)
        }
      },
     /* changeMode(){ // 转移到mixin
        const  mode = (this.mode + 1) % 3
        this.setPlayMode(mode)
        let list = null
        if(mode === playMode.random){
          list = shuffle(this.sequenceList)
        }else {
          list = this.sequenceList
        }
        // 当歌曲列表顺序改变时候，要保证当前播放的歌曲不改变
        this.resetCurrentIndex(list)
        this.setPlayList(list)
      },*/
      /*resetCurrentIndex(list){
        // findIndex es6 语法
        let index = list.findIndex((item)=>{
          return item.id === this.currentSong.id
        })
        this.setCurrentIndex(index)
      },*/
      end(){
        // 如果是单曲循环播放
        if(this.mode === playMode.loop){
          this.loop()
        }else{
          this.next()
        }
      },
      loop(){
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        // 解决当单曲循环播放时候，歌曲结束后 歌词不会回到初始位置
        if(this.currentLyric){
          // 偏移到最开始
          this.currentLyric.seek(0)
        }
      },
      getLyric(){
        // song的构造方法
        this.currentSong.getLyric().then((lyric)=>{
          // 歌词解码
          this.currentLyric = new Lyric(lyric,this.handleLyric)
          if( this.playing){
            this.currentLyric.play()
          }
        }).catch(()=>{
          // 当获取歌词发生异常
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        })
      },
      // 回调函数,注意该函数参数是一个Object
      handleLyric({lineNum,txt}){
        this.currentLineNum = lineNum
        // 当歌词行数变化，滚动位置
        if (lineNum > 5) {
          //                       歌词行
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt
      },
      middleTouchStart(e){
        this.touch.initiated = true
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      middleTouchMove(e){
        if(!this.touch.initiated){
          return
        }
        const touch = e.touches[0]
        const deltax = touch.pageX - this.touch.startX
        const deltay = touch.pageY - this.touch.startY
        if(Math.abs(deltay) > Math.abs(deltax)){
          // 当在歌词视图时，只支持纵向滚动
          return
        }
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth,left + deltax))
        console.log('deltax='+deltax)
        console.log('left='+left)
        console.log('offsetWidth='+offsetWidth)
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)

        // $el表示该组件的dom元素
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = 0
        // 改变唱片视图渐隐程度,不加$el,因为其是dom引用了
        this.$refs.middleL.style.opacity = 1- this.touch.percent
        this.$refs.middleL.style[transitionDuration] = 0
      },
      middleTouchEnd(){
        let offsetWidth
        let opacity
        // 如果是从右往左滑
        if(this.currentShow === 'cd'){
          if(this.touch.percent > 0.2){
            offsetWidth = -window.innerWidth
            opacity = 0
            this.currentShow = 'lyric'
          }else{
            offsetWidth = 0
            opacity = 1
          }
        }else{
          // 从左往右滑
          if(this.touch.percent < 0.8){
            offsetWidth = 0
            this.currentShow = 'cd'
            opacity = 1
          }else{
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        const time = 300
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`

        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style[transitionDuration] = `${time}ms`
      }
    },
    watch:{
      currentSong(newSong,oldSong){
        // 如果删除最后一首歌曲之后
        if(!newSong.id){
          console.log('nosong')
          return
        }
        //切换模式时候，当前歌曲不要发生变化
        if(newSong.id === oldSong.id){
          return
        }
        // 解决当快速前进 后退时候，歌词滚动乱跳问题
        if(this.currentLyric){
          this.currentLyric.stop()
        }
        // 为了保证在微信端打开，从后台切换到前台不播放问题？
        setTimeout(()=>{
          this.$refs.audio.play()
          this.getLyric()
        },1000)
        // 当audio dom元素加载完有变化后开始播放
        /*this.$nextTick(()=>{
          this.$refs.audio.play()
          this.getLyric()
        })*/
      },
      playing(newPlaying){
        const audio = this.$refs.audio
        this.$nextTick(()=>{
          newPlaying ? audio.play() : audio.pause()
        })

      }
    },
    components:{
      ProgressBar,
      ProgressCircle,
      Scroll,
      Playlist
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
