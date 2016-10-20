import Vue from 'vue'

// 分发获取用户信息的mutation
export const userInfo = store => {
  Vue.http
    .get('/request/forum/user')
    .then((data) => {
      store.dispatch('USERINFO', data.body)
    }, (err) => {
      console.log(err)
    })
}

export const toast = (store, text) => {
  store.dispatch('TOASTS', text)
}
