import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from '../common/js/util'

function findIndex (list,targetSong) {
    return list.findIndex((item)=>{
      return item.id === targetSong.id
    })
}
export const selectPlay = function ({commit,state},{list,index}) {
  //console.log('comit='+commit)
/* comit=function boundCommit(type, payload, options) {
  return commit.call(store, type, payload, options)
} */
  commit(types.SET_SEQUENCE_LIST,list)
  // 解决当随机播放时候，点选其中一首歌，但不是点选的歌曲的bug,
  // 原教学中洗牌函数没有纠正原数组是会出现这种问题，纠正后发现并不存在这个bug
/*  if (state.mode === playMode.random){
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST,randomList)
    index = findIndex(randomList,list[index])
  }else{
    commit(types.SET_PLAYLIST,list)
  }*/
  commit(types.SET_PLAYLIST,list)
  commit(types.SET_CURRENT_INDEX,index)
  commit(types.SET_FULL_SCREEN,true)
  commit(types.SET_PLAYING_STATE,true)
}
export const randomPlay = function ({commit},{list}) {
  commit(types.SET_PLALY_MODE,playMode.random)
  commit(types.SET_SEQUENCE_LIST,list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST,randomList)
  commit(types.SET_CURRENT_INDEX,0)
  commit(types.SET_FULL_SCREEN,true)
  commit(types.SET_PLAYING_STATE,true)
}
// 情景：在搜索结果页点选歌曲或者歌手，跳转时候，并不是清除原先playlist
// 而是添加修改其中的状态
export const inserSong = function ({commit,state},song) {
  let playlist = state.playlist
  let sequenceList = state.sequenceList
  let currentIndex = state.currentIndex
  // 逻辑解释,假如当前插入数组如下
  /*var arr = [1,2,3,4,2]*/
  //记录当前歌曲，假如当前歌曲为4
  let currrentSong = playlist[currentIndex]
  // 查找当前列表中是否有待插入的歌曲，并返回其索引，假如插入歌曲是2，并且当前歌曲有，是2，在第二个位置，返回
  let fpIndex = findIndex(playlist,song)
  // 因为是插入歌曲，所以所以+1，假如当前索引是4， 加一后在第五个插入
  currentIndex++
  // 插入这首歌到当前索引位置
  playlist.splice(currentIndex,0,song)
  // 如果已经包含了这首歌,则删除
  if(fpIndex > -1){ //从以上假设，该位置有且是第2个
    // 如果当前插入的序号大于列表中的序号,则删除找到的；
    if(currentIndex > fpIndex){ // 当前是在第5个，大于找到的 第二个
      // 删掉找到的第二个，变为[1,3,4,2]
      playlist.splice(fpIndex,1)
      // 删除后数组长度-1
      currentIndex--
    }else{
      // 假如当前的歌曲（索引）是第二个，删掉后一个
      //var arr = [1,2,2,3,4,]
      // 变 [1,2,3,4]
      playlist.splice(fpIndex +1 ,1)
    }
  }
}
