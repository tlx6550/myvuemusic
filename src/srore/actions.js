import * as types from './mutation-types'
export const selectPlay = function ({commit,state},{list,index}) {
  //console.log('comit='+commit)
/* comit=function boundCommit(type, payload, options) {
  return commit.call(store, type, payload, options)
} */
  commit(types.SET_SEQUENCE_LIST,list)
  commit(types.SET_PLAYLIST,list)
  commit(types.SET_CURRENT_INDEX,index)
  commit(types.SET_FULL_SCREEN,true)
  commit(types.SET_PLAYING_STATE,true)
}
