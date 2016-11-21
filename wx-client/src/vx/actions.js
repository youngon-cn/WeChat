import Vue from 'vue'

// 分发获取用户信息的mutation
export const getUser = (store) => {
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

export const getFirstPagePosts = (store, type) => {
  store.dispatch('REFRESHING')
  Vue.http
    .get('/request/forum/posts/firstPage?type=' + type)
    .then((data) => {
      store.dispatch('REFRESHING')
      store.dispatch('FIRSTPAGEPOSTS', data.body)
    }, (err) => {
      store.dispatch('REFRESHING')
      console.log(err)
    })
}

export const getNextPagePosts = (store, post, type) => {
  if (post) {
    store.dispatch('LOADING')
    Vue.http
      .get('/request/forum/posts/nextPage?updateDate=' + post.updateDate + '&type=' + type)
      .then((data) => {
        store.dispatch('LOADING')
        if (data.body.length) {
          store.dispatch('MOREPOSTS', data.body)
        }
      }, (err) => {
        store.dispatch('LOADING')
        console.log(err)
      })
  }
}

export const toogleRefreshing = (store) => {
  store.dispatch('REFRESHING')
}

export const toogleLoading = (store) => {
  store.dispatch('LOADING')
}

export const postUpdate = (store, index, pv, nc, type) => {
  store.dispatch('POSTSTATE', index, pv, nc, type)
}

export const scrollSet = (store, scrollTop) => {
  store.dispatch('SCROLLSET', scrollTop)
}

export const setPostsType = (store, type) => {
  store.dispatch('POSTSTYPE', type)
}

export const toast = (store, text) => {
  store.dispatch('TOASTS', text)
}

export const alert = (store, title, msg, type) => {
  store.dispatch('ALERT', {
    title: title,
    msg: msg,
    type: type,
    show: true
  })
}
