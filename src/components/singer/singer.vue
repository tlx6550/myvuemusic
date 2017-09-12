<template>
  <div  class="singer" ref="singer">
    <list-view @select="selectSinger" :data="singers" ref="list"></list-view>
    <!--需要路由组件承载子控件-->
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import  {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import Singer from 'common/js/singer'
  // 驼峰写法，写页面标签时候，组件标签一定要加破折号才能正确引人
  import ListView from 'base/listview/listview'
  //创建组件方法提交 mutation
  import {mapMutations} from 'vuex'
  // 一定要在export 声明引入
  import {playlistMixin} from 'common/js/mixin'
  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10
  export default {
    // 一个组件可以插入多个mixin
    mixins:[playlistMixin],
    data(){
      return{
        singers:[]
      }
    },
    created(){
      this._getSingerList()
    },
    methods:{
      selectSinger(singer){
        //编程式的导航https://router.vuejs.org/zh-cn/essentials/navigation.html
        this.$router.push({
          path:`/singer/${singer.id}`
        })
        //提交到状态树state里
        this.setSinger(singer)
      },
      _getSingerList(){
        getSingerList().then((res)=>{
          if(res.code === ERR_OK){
            this.singers = this._normalizeSinger(res.data.list)
          }
        })
      },
      _normalizeSinger(list){
        let map = {
          hot:{
            title:HOT_NAME,
            items:[]
          }
        }
        list.forEach((item,index)=>{
          if(index < HOT_SINGER_LEN){
            map.hot.items.push(new Singer({
              name:item.Fsinger_name,
              id:item.Fsinger_mid
            }))
          }
          const key = item.Findex
          if(!map[key]){
            map[key] = {
              title:key,
              items:[]
            }
          }
          map[key].items.push(new Singer({
            name:item.Fsinger_name,
            id:item.Fsinger_mid
          }))
        })
        // 为了得到有序列表，我们需要处理 map
        let ret = []
        let hot = []
        for(let key in map){
          let val = map[key]
          if(val.title.match(/[a-zA-Z]/)){
            ret.push(val)
          }else if(val.title === HOT_NAME){
            hot.push(val)
          }
        }
        // JS数组排序方法,charCodeAt返回字符串 Unicode 编码。
        ret.sort((a,b)=>{
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        // 数组连接
        return hot.concat(ret)
      },
      handlePlaylist(playlist){
        // 当有底部栏时，滚动组件要腾出位置 以致使滚动完列表 显示完整
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
      },
      // 使用对象展开运算符将 getters 混入 methods 对象中，method就有了更改状态的方法了
      ...mapMutations({
        // 映射 this.setSinger() 为 this.$store.commit('SET_SINGER')
        setSinger:'SET_SINGER'
      })
    },
    components:{
      ListView
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
