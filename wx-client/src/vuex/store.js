import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 创建一个对象来保存应用启动时的初始状态
const state = {
  user: {},
  posts: [],
  loading: false,
  refreshing: false,
  toasts: []
}

const mutations = {
  USERINFO (state, data) {
    state.user = data
  },
  NEWPOSTS (state, data) {
    for (let post of data) {
      state.posts.unshift(post)
    }
  },
  POSTS (state, data) {
    for (let post of data) {
      state.posts.push(post)
    }
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
  }
}

const store = new Vuex.Store({
  state,
  mutations
})

export default store
