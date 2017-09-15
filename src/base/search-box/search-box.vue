<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" type="text" v-model="query" class="box" :placeholder="placeholder">
    <i @click="clear" v-show="query" class="icon-dismiss"></i>
  </div>
</template>

<script type="text/ecmascript-6">
  //引入节流函数
  import {debounce} from 'common/js/util'
  export default {
    created(){
      // 作用类似watch方法
      //节流函数，使用场景：如搜索框不断输入新的关键词，或者连续删掉某个关键词，导致不断发起搜索查询请求
      this.$watch('query',debounce((newQuery) =>{
        this.$emit('query',newQuery)
      },200))
    },
    props:{
      placeholder:{
        type:String,
        default:'搜索歌曲，歌手'
      }
    },
    data(){
      return{
        query:''
      }
    },
    methods:{
      clear(){
        this.query = ''
      },
      setQuery(query){
        this.query = query
      },
      blur(){
        this.$refs.query.blur()
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>
