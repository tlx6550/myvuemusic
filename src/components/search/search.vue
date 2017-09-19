<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box @query="onQueryChange" ref="searchBox"></search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <!--scroll组件只对其中第一个子元素的高度计算是否滚动，
      针对该组件有两个并级的元素，需要引人一个div包裹他们-->
      <!--绑定的data是用一个计算属性shotcut，因为其子元素的数据都是异步获取的，
      所以只要其中一个变化，那么data将再次计算-->
      <scroll ref="shortcut" class="shortcut" :data="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)" class="item" v-for="item in hotKey">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <!--<span class="clear" @click="deleteAll">-->
              <!--等价于下面，直接使用mapActions的混入方法，注意参数是否要传递，是否要显式传递，是否已经映射过来clearSearchHistory-->
              <span class="clear" @click="showConfirm">
               <i class="icon-clear"></i>
             </span>
            </h1>
            <search-list @select="addQuery" :searches="searchHistory" @delete="deleteOne"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div ref="searchResult" class="search-result" v-show="query">
      <suggest ref="suggest" @select="saveSearch" @listScroll="blurInput" :query="query"></suggest>
    </div>
    <confirm @confirm="clearSearchHistory" ref="confirm" text="是否清空所有搜索历史数据" confirmBtnText="清空"></confirm>
    <!--当点击搜搜结果页跳转到相应页面-->
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import SearchList from 'base/search-list/search-list'
  import Confirm from 'base/confirm/confirm'
  import Scroll from 'base/scroll/scroll'
  import {getHotKey} from 'api/search'
  import {ERR_OK} from 'api/config'
  import Suggest from 'components/suggest/suggest'
  import {mapActions,mapGetters} from 'vuex'
  import {playlistMixin,searchMixin} from 'common/js/mixin'
  export default {
    mixins:[playlistMixin, searchMixin],
    created(){
      this._getHotKey()
    },
    data(){
      return {
        hotKey:[]/*,
        query:''*/
      }
    },
    methods:{
      handlePlaylist(playlist){
        // 解决当有搜索记录，有搜索结果时候，点击播放歌曲，最小化时候，滚动组件滚动高度要自适应问题
        const bottom = playlist.length > 0 ? '60px' : ''

        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()

        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()

      },
     /* addQuery(query){
        this.$refs.searchBox.setQuery(query)
      },*/
      /*onQueryChange(query){
        this.query = query
      },*/
      _getHotKey(){
        getHotKey().then((res)=>{
          if (res.code === ERR_OK){
           this.hotKey = res.data.hotkey.slice(0,10)
          }
        })
      },
      /*// 解决当在移动端情景，在搜索输入框输入关键词时候，默认会调用
      //移动端的键盘事件，如果输入后，用户需要滚动，则需要把该事件屏蔽
      blurInput(){
        this.$refs.searchBox.blur()
      },*/
      ...mapActions([
        /*'saveSearchHistory',
        'deleteSearchHistory',*/
        'clearSearchHistory'
      ]),
      /*saveSearch(){
        this.saveSearchHistory(this.query)
      },*/
      deleteOne(item){
        this.deleteSearchHistory(item)
      },
      /*没使用到 deleteAll(){
        this.clearSearchHistory()
      },*/
      showConfirm(){
        this.$refs.confirm.show()
      }
    },
    computed:{
      ...mapGetters([
         /* 'searchHistory'*/ // 移到minxin
      ]),
      shortcut(){
        return this.hotKey.concat(this.searchHistory)
      }
    },
    watch:{
      query(newQuery){
        //解决从suggest切换到主页的时候，搜索记录列表无法滚动的问题
        if(!newQuery){
          setTimeout(()=>{
            this.$refs.shortcut.refresh()
          },20)
        }
      }
    },

    components:{
      SearchBox,
      Suggest,
      SearchList,
      Confirm,
      Scroll
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
