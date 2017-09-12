<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" :data="discList" ref="scroll">
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <img @load="loadImage" :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in discList" class="item">
              <div class="icon">
                <!--fastclik 与 better-scroll冲突，
                由于我们在滚动组件需要点击事件，
                而fastclick会阻止默认行为，
                所以要加上类，让其知道这需要点击-->
                <img class="needsclick" v-lazy="item.imgurl" width="60" height="60">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
                <!--<h2 class="name">{{item.creator.name}}</h2>
                <p class="desc">{{item.dissname}}</p>-->
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getRecommend,getDiscList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import Slider from 'base/slider/slider'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  // 一定要在export 声明引入
  import {playlistMixin} from 'common/js/mixin'
  export default {
    // 一个组件可以插入多个mixin
    mixins:[playlistMixin],
    data() {
      return {
        recommends: [],
        discList:[]
      }
    },
    created() {
      // 为何把请求数据放在这个钩子函数中 https://zhuanlan.zhihu.com/p/27407024
      this._getRecommend()
      this._getDiscList()
    },
    methods: {
      _getRecommend() {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
          }
        })
      },
      _getDiscList(){
        getDiscList().then((res)=>{
          if(res.code === ERR_OK){
            this.discList = res.data.list
          }
        })
      },
      loadImage(){
        // 图片加载事件只执行一次，保证滚动高度可行
        if(!this.checkLoad){
          this.$refs.scroll.refresh();
          this.checkLoad = true;
        }
      },
      handlePlaylist(playlist){
        // 当有底部栏时，滚动组件要腾出位置 以致使滚动完列表 显示完整
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      }
    },
    components: {
      Slider,
      Scroll,
      Loading
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        background-color :$color-background
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>

