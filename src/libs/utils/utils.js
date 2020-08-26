const utils = {
  /**
   * 存一条cookie
   * @param {string} key    要存的cookie的名称
   * @param {string} value  要存的cookie的值
   * @param {object} option 过期事件和路径，如：{ expires: 7, path: '/' } 就是7天过期的根路径的cookie
   */
  setCookie (key, value, option) {
    // 存的时候编码
    var str = `${key}=${encodeURIComponent(value)}`
    if (option) {
      if (option.path) {
        str += `;path=${option.path}`
      }
      if (option.expires) {
        // 有过期时间
        var date = new Date()
        date.setDate(date.getDate() + option.expires)
        str += `;expires=${date.toUTCString()}`
      }
    }
    document.cookie = str
  },
  /**
   * 获取cookie的方法
   * @param  {string} key 要获取的cookie的名称
   * @return {string}     这条cookie的值，如果没有这条cookie返回undefined
   */
  getCookie (key) {
    var str = document.cookie
    var arr = str.split('; ')
    var obj = {}
    arr.forEach(function (cookie) {
      var arr1 = cookie.split('=')
      // 把arr1[0]作为属性名，arr1[1]作为属性值放入obj里
      // 取值的时候解码
      obj[arr1[0]] = decodeURIComponent(arr1[1])
    })
    return obj[key]
  },
  /**
   * 发送ajax的get请求
   * @param {string}   url    请求地址
   * @param {object}   query  请求携带的参数
   * @param {function} cb     请求成功之后的回调
   * @param {boolean}  isJson 是否json序列化，默认为true
   */
  get (url, query, cb, isJson = true) {
    // 函数参数默认值，ES6语法，不传参数默认为true，传了参数那就是传的值
    // 如果有参数，需要把参数拼接在url后面
    if (query) {
      url += '?'
      for (var key in query) {
        url += `${key}=${query[key]}&`
      }
      url = url.slice(0, -1)
    }
    var xhr = new XMLHttpRequest()
    xhr.open('get', url)
    xhr.send()
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // 请求成功
          var data = isJson ? JSON.parse(xhr.responseText) : xhr.responseText
          cb && cb(data)
        }
      }
    }
  },

  /**
   * 发送ajax的post请求
   * @param {string}   url    请求地址
   * @param {object}   query  请求携带的参数
   * @param {function} cb     请求成功之后的回调
   * @param {boolean}  isJson 是否json序列化，默认为true
   */
  post (url, query, cb, isJson = true) {
    var str = ''
    if (query) {
      for (var key in query) {
        str += `${key}=${query[key]}&`
      }
      str = str.slice(0, -1)
    }

    var xhr = new XMLHttpRequest()
    xhr.open('post', url)
    // 告诉后端请求数据是以urlencoded的方式来发送的
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded")
    xhr.send(str)
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var data = isJson ? JSON.parse(xhr.responseText) : xhr.responseText
          cb && cb(data)
        }
      }
    }
  },

  /**
   * 发送jsonp请求
   * @param {string} url     接口地址
   * @param {string} cbName  全局回调函数名
   * @param {object} query   请求携带的其他参数
   */
  jsonp (url, cbName, query) {
    url += `?cb=${cbName}`
    if (query) {
      for (var key in query) {
        url += `&${key}=${query[key]}`
      }
    }
    var script = document.createElement('script')
    script.src = url
    document.body.appendChild(script)
    // 只要script标签存在。异步请求就发出去了，所以留着也没用，可以直接删掉，过河拆桥
    document.body.removeChild(script)
  },

  /**
   * 发送基于promise的ajax的get请求
   * @param {string}   url    请求地址
   * @param {object}   query  请求携带的参数
   * @param {boolean}  isJson 是否json序列化，默认为true
   */
  fetch (url, query, isJson = true) {
    if (query) {
      url += '?'
      for (var key in query) {
        url += `${key}=${query[key]}&`
      }
      url = url.slice(0, -1)
    }
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest()
      xhr.open('get', url)
      xhr.send()
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            // 请求成功
            var data = isJson ? JSON.parse(xhr.responseText) : xhr.responseText
            resolve(data)
          } else {
            reject()
          }
        }
      }
    })
  }
}

