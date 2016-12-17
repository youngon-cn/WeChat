export const user = state => state.user
export const posts = state => {
  for (let post of state.posts) {
    post.charger = post.charger || {}
  }
  return state.posts
}
export const postsType = state => state.postsType
export const refreshing = state => state.refreshing
export const loading = state => state.loading
export const scrollTop = state => state.scrollTop
export const toasts = state => state.toasts
export const alert = state => state.alert
