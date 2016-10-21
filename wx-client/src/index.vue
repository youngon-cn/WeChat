<template lang="pug">
router-view(keep-alive)
toast(v-for="toast in toasts", :text="toast.text", :center="toast.center")
</template>

<script>
import { getUser } from './vuex/actions'
import { toasts } from './vuex/getters'

export default {
  ready () {
    var ua = navigator.userAgent.toLowerCase()
    var isWeixin = ua.indexOf('micromessenger') !== -1
    this.tryAuth(3, isWeixin)
  },
  methods: {
    tryAuth (time, isWeixin) {
      setTimeout(() => {
        if (isWeixin && this.$route.query.state === 'wxoauth') {
          this.$http
            .get('/request/forum/wxoauth?code=' + this.$route.query.code)
            .then((data) => {
              if (data.body.state === 1) {
                this.getUser()
              }
            }, (err) => {
              console.log(err)
            })
        } else {
          time > 1 ? this.tryAuth(time - 1) : this.getUser()
        }
      }, 300)
    }
  },
  vuex: {
    actions: {
      getUser
    },
    getters: {
      toasts
    }
  }
}
</script>

<style lang="stylus">
html, body
  margin 0
  padding 0
</style>
