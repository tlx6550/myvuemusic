export const commonParams = {
  g_tk: 1928093487,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp'
}
// 按原教学中设置，导致取热门歌单详情会报回掉函数无定义
// 顾参考原npm jsonp api从新设置如下
export const options = {
  prefix:'__jp',
  param: 'jsonpCallback',
  name:'musicCallback'
}
export const ERR_OK = 0
