import {playMode} from 'common/js/config'
// 全局状态树
const state = {
  singer: {},
  // 歌曲状态信息
  // 是否自动播放
  playing:false,
  // 是否全屏播放
  fullScreen:false,
  // 歌单列表
  playlist:[],
  // 播放顺序列表、循环、单曲...
  sequenceList:[],
  mode: playMode.sequence,
  // 当前播放索引
  currentIndex: -1
}
export default state
