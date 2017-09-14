import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

export function getHotKey () {
  // 刚进入搜索页的请求接口
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    format:'json',
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options)
}
// 关键词搜索
/**
 *
 * @param query 关键词
 * @param page 页数
 * @param zhida 歌手信息 type Boolean
 * @param perpage 每页歌曲数目
 */
export function search (query,page,zhida,perpage) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

  const data = Object.assign({}, commonParams, {
    w: query,
    p: page,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    n:perpage,
    flag: 1,
    perpage:perpage,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options)
}
