function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
// 洗牌函数
export function shuffle(arr) {
  // slice方法的返回值不改版原来数组，并返回一个新的数组
   let _arr = arr.slice()
  //let _arr = arr

  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }

  return _arr
}
// 节流函数，使用场景：如搜索框不断输入新的关键词，或者连续删掉某个关键词，导致不断发起搜索查询请求
export function debounce(func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
