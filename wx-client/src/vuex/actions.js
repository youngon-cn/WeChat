import Vue from 'vue'

// 分发获取用户信息的mutation
export const getUser = store => {
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

export const getNewPosts = (store, _id) => {
  store.dispatch('REFRESHING')
  Vue.http
    .get('/request/forum/posts/new?_id=' + _id)
    .then((data) => {
      store.dispatch('REFRESHING')
      if (data.body.length) {
        store.dispatch('NEWPOSTS', data.body)
      } else {
        store.dispatch('TOASTS', '没有数据更新')
      }
    }, (err) => {
      console.log(err)
    })
}

export const getFirstPagePosts = store => {
  store.dispatch('REFRESHING')
  Vue.http
    .get('/request/forum/posts/firstPage')
    .then((data) => {
      store.dispatch('REFRESHING')
      store.dispatch('POSTS', data.body)
    }, (err) => {
      console.log(err)
    })
}

export const getNextPagePosts = (store, _id) => {
  store.dispatch('LOADING')
  Vue.http
    .get('/request/forum/posts/nextPage?_id=' + _id)
    .then((data) => {
      store.dispatch('LOADING')
      if (data.body.length) {
        store.dispatch('POSTS', data.body)
      } else {
        store.dispatch('TOASTS', '没有更多数据了')
      }
    }, (err) => {
      console.log(err)
    })
}

export const toogleRefreshing = store => {
  store.dispatch('REFRESHING')
}

export const toogleLoading = store => {
  store.dispatch('LOADING')
}

export const toast = (store, text) => {
  store.dispatch('TOASTS', text)
}
