<template>
  <transition name="slide">
    <div class="singer-detail"></div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  export default {
    data(){
      return{
        songs:[]
      }
    },
    computed:{
      ...mapGetters([
        'singer'
      ])
    },
    created(){
      this._getDetail()
      console.log(this.singer)
    },
    methods:{
      _getDetail(){
        //当用户不小心刷新不存在的id页面时候
        if(!this.singer.id){
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id).then((res)=>{
          if(res.code === ERR_OK){
            this.songs = this._normalizeSongs(res.data.list)
            console.log(this.songs)
          }
        })
      },
      _normalizeSongs(list){
        let ret = []
        list.forEach((item)=>{
          // 付给一个对象
          let {musicData} = item
          if(musicData.songid && musicData.albummid){
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
/*  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)*/
  @import "~common/stylus/variable"
  .singer-detail
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background :$color-background
  .slide-enter-active,.slide-leave-active
   transition :all 0.3s
  .slide-enter,slide-leave-to
   transform:translate3d(100%,0,0)
</style>
