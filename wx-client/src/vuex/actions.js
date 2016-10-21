import Vue from 'vue'

// 分发获取用户信息的mutation
export const userInfo = store => {
  Vue.http
    .get('/request/forum/user')
    .then((data) => {
      var ua = navigator.userAgent.toLowerCase()
      var isWeixin = ua.indexOf('micromessenger') !== -1
      if (isWeixin && data.body.turnUrl) {
        return (window.location.href = data.body.turnUrl)
      }
      store.dispatch('USERINFO', data.body)
    }, (err) => {
      console.log(err)
    })
}

export const toast = (store, text) => {
  store.dispatch('TOASTS', text)
}
