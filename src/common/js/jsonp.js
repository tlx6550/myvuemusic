import originJsonp from 'jsonp'

export default function jsonp(url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)

  return new Promise((resolve, reject) => {
    originJsonp(url, option, (err, data) => {
      if (!err) {
        // 把请求服务器返回的数据data，塞进resolve中，以便then回掉使用
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

/* export function param(data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    encodeURIComponent() 函数[1] 可把字符串作为URI 组件进行编码。
    encodeURIComponent("Hello world!")=>Hello%20world!
    url += '&' + k + '=' + encodeURIComponent(value)
  }
  return url ? url.substring(1) : ''
} */
function param(data) {
  /* data={"g_tk":1928093487,"inCharset":"utf-8","outCharset":"utf-8","notice":0,"format":"jsonp","platform":"h5","uin":0,"needNewCode":1} */
  let url = ''
  for (var k in data) {
    console.log('k=' + k)
    let value = data[k] !== undefined ? data[k] : ''
    url += '&' + k + '=' + encodeURIComponent(value)
  }
  /* url=&g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&platform=h5&uin=0&needNewCode=1 */
  return url ? url.substring(1) : ''
}
