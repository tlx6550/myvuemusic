//修改状态的地方
import * as types from './mutation-types'

const matutaions = {
  //可以向 store.commit 传入额外的参数，即 mutation 的 载荷（payload）：
  [types.SET_SINGE](state,singer){
    state.singer = singer
  },
  [types.SET_PLAYING_STATE](state,flag){
    state.playing = flag
  },
  [types.SET_FULL_SCREEN](state,flag){
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST](state,list){
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST](state,list){
    state.sequenceList = list;
  },
  [types.SET_PLAY_MODE](state,mode){
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX](state,index){
    state.currentIndex = index
  }
}
export default matutaions
