import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 创建一个对象来保存应用启动时的初始状态
const state = {
  user: {},
  posts: [],
  postsType: 9,
  loading: false,
  refreshing: false,
  scrollTop: 0,
  toasts: [],
  alert: {
    show: false
  }
}

const mutations = {
  USERINFO (state, data) {
    state.user = data
  },
  FIRSTPAGEPOSTS (state, data) {
    state.posts = data
  },
  MOREPOSTS (state, data) {
    for (let post of data) {
      state.posts.push(post)
    }
  },
  POSTSTYPE (state, data) {
    state.postsType = data
  },
  FORUMSTATE (state, index, scrollTop) {
    state.posts[index].pv++
    state.scrollTop = scrollTop
  },
  POSTSTATE (state, index, type) {
    state.posts[index].nc++
    if (type) state.posts[index].type = type
  },
  SCROLLINIT (state) {
    state.scrollTop = 0
  },
  LOADING (state) {
    state.loading = !state.loading
  },
  REFRESHING (state) {
    state.refreshing = !state.refreshing
  },
  TOASTS (state, data) {
    state.toasts.push({ text: data })
    setTimeout(() => state.toasts.splice(0, 1), 2000)
  },
  ALERT (state, data) {
    state.alert = data
  }
}

const store = new Vuex.Store({
  state,
  mutations
})

export default store
