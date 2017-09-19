import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from '../common/js/util'
import {saveSearch,deleteSearch,clearSearch} from '../common/js/cache'
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
export const insertSong = function ({commit,state},song) {
  // playlist 是真正要播放的歌曲
  // 在后加slice创建 其副本，解决Do not mutate vuex store state outside mutation handlers（需要在mutation的回调函数中修改！）
  let playlist = state.playlist.slice()
  // sequenceList 是播放模式的歌曲列表，是要映射到playlist的
  let sequenceList = state.sequenceList.slice()
  // currentIndex 不用添加，因为这里并不是修改其mutation
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
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
  // 新插入播放模式列表（循环，随机...）歌曲的位置
  let currentSIndex = findIndex(sequenceList,currentSong) + 1
  // 查找该播放列表是否有该新插入的歌曲
  let fsIndex = findIndex(sequenceList,song)
  // 插入歌曲
  sequenceList.splice(currentSIndex,0,song)
  if(fsIndex > -1){
    // 如果当前索引大于找到的索引，则删除找到的
    if(currentIndex > fsIndex){
      sequenceList.splice(fsIndex,1)
    }else{
      // 否则就删掉后一个
      sequenceList.splice(fsIndex + 1,1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 封装保存搜索结果的mutation，并把结果缓存到localstore中，以便浏览器关掉再打开可以继续查看
export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}
// 删除某项
export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}
// 清空搜索记录
export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}
// 删除歌曲
export const deleteSong = function ({commit,state},song) {
  let playlist = state.playlist.slice()
  // sequenceList 是播放模式的歌曲列表，是要映射到playlist的
  let sequenceList = state.sequenceList.slice()
  // currentIndex 不用添加，因为这里并不是修改其mutation
  let currentIndex = state.currentIndex
  let pIndex = findIndex(playlist,song)
  console.log(song)
  playlist.splice(pIndex,1)
  let sIndex = findIndex(sequenceList,song)
  sequenceList.splice(sIndex,1)
  // 如果当前播放索引大于找到的
  if(currentIndex > pIndex || currentIndex === playlist.length){
    currentIndex--
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  const playingState = playlist.length > 0
  commit(types.SET_PLAYING_STATE, playingState)
  /*等价于*/
  /*if(!playlist.length){
    commit(types.SET_PLAYING_STATE, false)
  }else{
    commit(types.SET_PLAYING_STATE, true)
  }*/
}
// 清空列表
export const deleteSongList = function ({commit}) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}
