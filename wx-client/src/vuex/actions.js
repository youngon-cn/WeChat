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

export const getFirstPagePosts = (store, type) => {
  store.dispatch('REFRESHING')
  Vue.http
    .get('/request/forum/posts/firstPage?type=' + type)
    .then((data) => {
      store.dispatch('REFRESHING')
      store.dispatch('FIRSTPAGEPOSTS', data.body)
    }, (err) => {
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
        console.log(err)
      })
  }
}

export const toast = (store, text) => {
  store.dispatch('TOASTS', text)
}

export const goToDetail = (store, index, scrollTop) => {
  store.dispatch('FORUMSTATE', index, scrollTop)
}

export const postsUpdate = (store, index, type) => {
  store.dispatch('POSTSTATE', index, type)
}

export const scrollInit = store => {
  store.dispatch('SCROLLINIT')
}

export const setPostsType = (store, type) => {
  store.dispatch('POSTSTYPE', type)
}
