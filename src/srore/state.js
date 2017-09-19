import {playMode} from 'common/js/config'
import {loadSearch,loadPlay} from 'common/js/cache'
// 全局状态树
const state = {
  // 歌手对象
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
  currentIndex: -1,
  // 歌单对象
  disc:{},
  // 排行榜对象
  topList:{},
  // 搜索结果数组
  searchHistory: loadSearch(),
  // 播放历史
  playHistory:loadPlay()
}
export default state
