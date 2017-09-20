// 本地存储的封装
import storage from 'good-storage'

const SEARCH_KEY = '__search__'
// 定义最多缓存数据个数
const SEARCH_MAX_LEN = 15

const PLAY_KEY = '__play__'
// 最多已播放数目
const PLAY_MAX_LEN = 200
// 收藏key
const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 200
// 定义插入数组方法，保证最新查询到的放在最前面
function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  // 原数组中有插入的，则删除原有的
  if (index > 0) {
    arr.splice(index, 1)
  }
  // unshift() 方法可向数组的[开头]添加一个或更多元素，并返回新的长度。
  // unshift() 方法无法在 Internet Explorer 中正确地工作
  // 要把一个或多个元素添加到数组的尾部，请使用 push() 方法。
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    // pop() 方法将删除 arrayObject 的最后一个元素，把数组长度减 1，并且返回它删除的元素的值。如果数组已经为空，则 pop() 不改变数组，并返回 undefined 值。
    arr.pop()
  }
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN)
  storage.set(SEARCH_KEY, searches)
  return searches
}
export function deleteSearch(query) {
  // get(key, def) API
  // get storage with key, return def if not find
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}
// 解决当搜索关键词后且第二次提交mutations state的searchHistory还没值的情况,且关闭浏览器后从新打开，state 的searchHistorym没有值 了
// 但是本人测试实际情况并没有发现该问题
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}
// 保存播放列表记录
export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, PLAY_MAX_LEN)
  storage.set(PLAY_KEY, songs)
  return songs
}
export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LEN)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}

