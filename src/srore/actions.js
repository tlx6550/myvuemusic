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
