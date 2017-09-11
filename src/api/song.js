import {commonParams} from './config'
import axios from 'axios'
// 获取歌词接口
export function getLyric (mid) {
  const  url = '/api/lyric'
  const data = Object.assign({},commonParams,{
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    /*请求回应的数据格式，原来的是jsonp*/
    format: 'json'
  })
  return axios.get(url,{
    params:data
  }).then((res) =>{
    return Promise.resolve(res.data)
  })
}
