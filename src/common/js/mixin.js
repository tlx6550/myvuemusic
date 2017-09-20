// 当各个组件调用相同业务功能时,可以抽取共同模块出来
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
// 所引组件一定要执行这些函数,否则就会抛异常,
// 定义组件时候,所定义的同名方法会覆盖这里定义的
export const playlistMixin = {

  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  // 当 keep-alive 组件切换时候触发
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const playerMixin = {
  computed:{
    iconMode(){
      return this.mode === playMode.sequence ? 'icon-sequence': this.mode === playMode.loop ?  'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'playlist',
      'mode',
      'favoriteList'
    ])
  },
  methods:{
    changeMode(){
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
    },
    resetCurrentIndex(list){
      // findIndex es6 语法
      let index = list.findIndex((item)=>{
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    getFavoriteIcon(song){
      if(this.isFavorite(song)){
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    toggleFavorite(song){
      if(this.isFavorite(song)){
       this.deleteFavoriteList(song)
      }else{
        this.saveFavoriteList(song)
      }
    },
    isFavorite(song){
      const index = this.favoriteList.findIndex((item)=>{
       return item.id === song.id
      })
      return index > -1
    },
    ...mapMutations({
      setPlayingState:'SET_PLAYING_STATE',
      setCurrentIndex:'SET_CURRENT_INDEX',
      setPlayMode:'SET_PLALY_MODE',
      setPlayList:'SET_PLAYLIST'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  },

}

export const searchMixin = {
    data(){
     /* refreshDelay由于动画执行需要时间（约100ms），而滚动组件监听数据变化是20ms，所以需要定制变化时间，使得滚动高度正确*/
    return {
      query:'',
      refreshDelay: 100
   }
  },
  computed:{
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods:{
    // 解决当在移动端情景，在搜索输入框输入关键词时候，默认会调用
    //移动端的键盘事件，如果输入后，用户需要滚动，则需要把该事件屏蔽
    blurInput(){
      this.$refs.searchBox.blur()
    },
    saveSearch(){
      this.saveSearchHistory(this.query)
    },
    onQueryChange(query){
      this.query = query
    },
    addQuery(query){
      this.$refs.searchBox.setQuery(query)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}
/*export const playerMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'playlist',
      'currentSong',
      'mode',
      'favoriteList'
    ])
  },
  methods: {
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlaylist(list)
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}

export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 120
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    onQueryChange(query) {
      this.query = query
    },
    blurInput() {
      this.$refs.searchBox.blur()
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}*/
