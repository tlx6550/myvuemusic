<template>
<scroll class="suggest"
        :data="result"
        :pullup="pullup"
        @scrollToEnd="searchMore"
        :beforeScroll="beforeScroll"
        @beforeScroll="listScroll"
        ref="suggest"
>
  <ul class="suggest-list">
    <li @click="selectItem(item)" class="suggest-item" v-for="item in result">
      <div class="icon">
        <i :class="getIconCls(item)"></i>
      </div>
      <div class="name">
        <p class="text" v-html="getDisplayName(item)"></p>
      </div>
    </li>
    <loading v-show="hasMore" title="加载中..."></loading>
  </ul>
  <div v-show="!hasMore && !result.length" class="no-result-wrapper">
    <!--传入的title是写死的，所以不用bind指令：-->
    <no-result title="暂无搜索结果"></no-result>
  </div>
</scroll>
</template>

<script type="text/ecmascript-6">
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import {mapMutations, mapActions} from 'vuex'
  import Singer from 'common/js/singer'
  import Scroll from  'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import NoResult from 'base/no-result/no-result'
  const TYPE_SINGER = 'singer'
  const perpage = 20
  export default {
    data(){
      return{
        // 当前页数
        page:1,
        result:[],
        // 开启上拉刷新
        pullup:true,
        //标识
        hasMore:true,
        //开始滚动之前
        beforeScroll:true
      }
    },
    props:{
      query:{
        type:String,
        default:''
      },
      // 是否展示歌手信息
      showSinger:{
        type:Boolean,
        default:true
      }
    },
    methods:{
      _search(){
        // 第一次执行都重置为1 ，解决当查询条件发生变化的时候，scroll位置滚动不对
        this.page = 1
        this.$refs.suggest.scrollTo(0,0)
        this.hasMore = true
        // 执行查询接口
        search(this.query,this.page,this.showSinger,perpage).then((res)=>{
          if(res.code === ERR_OK){
            this.result = this._getResult(res.data)
            // 检查是否还有更多数据
            this._checkMore(res.data)
          }
        })
      },
      _checkMore(data){
        const song = data.song
       /*数据结构 song: {
          curnum: 20,
            curpage: 1,
            list: [....],
            totalnum: 398
        }*/
        if (!song.list.length || (song.curnum + song.curpage * perpage) >= song.totalnum) {
          this.hasMore = false
        }
      },
      searchMore(){
        if(!this.hasMore){
          return
        }
        this.page++
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if(res.code === ERR_OK){
            // 把原有的拼接在一起
            this.result =this.result.concat( this._getResult(res.data))
            // 检查是否还有更多数据
            this._checkMore(res.data)
          }
        })
      },
      getDisplayName(item){
        if(item.type === TYPE_SINGER){
          return item.singername
        }else{
          //  return `${item.songname}-${filterSinger(item.singer)}`
          return `${item.name}-${item.singer}`
        }
      },
      // 点击跳转
      selectItem(item){
        if(item.type === TYPE_SINGER){
          const singer = new Singer({
            id:item.singermid,
            name:item.singername
          })
          // 该路由实例是其父组件的路由实例
          this.$router.push({
            path:`/search/${singer.id}`
          })
          // 提交mutation
          this.setSinger(singer)
        }else{
          this.insertSong(item)
        }
        // 向外派发被选择事件（记录该歌曲进历史列表），本身不做该事情
        this.$emit('select')
      },
      _normalizeSongs(list){
        let ret = []
        list.forEach((musicData)=>{
          if(musicData.songid && musicData.albummid){
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      getIconCls(item){
        if(item === TYPE_SINGER){
          return 'icon-mine'
        }else{
          return 'icon-music'
        }
      },
      _getResult(data){
        let ret = []
        if(data.zhida && data.zhida.singerid){
          // ...扩展运算符 http://blog.csdn.net/qq_30100043/article/details/53391308
          ret.push({...data.zhida,...{type:TYPE_SINGER}})
        }
        if(data.song){
          //    ret = ret.concat(data.song.list)
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      listScroll(){
        this.$emit('listScroll')
      },
      ...mapMutations({
        setSinger:'SET_SINGER'
      }),
      ...mapActions({
        insertSong:'insertSong'
      })
    },
  components:{
    Scroll,
    Loading,
    NoResult
  },
    watch:{
      query(){
        this._search()
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
