<template lang="pug">
router-view(keep-alive)
toast(v-for="toast in toasts", :text="toast.text", :center="toast.center")
alert(:title="alert.title", :type="alert.type", :show.sync="alert.show", :msg="alert.msg")
</template>

<script>
import { getUser } from './vuex/actions'
import { toasts, alert } from './vuex/getters'

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
      toasts,
      alert
    }
  }
}
</script>

<style lang="stylus">
html, body
  margin 0
  padding 0

img.youngon
  width 18px
  height 18px

.nav-icon-logo
  width 80px
  height 80px
  font-size 50px
  display -webkit-box
  display -ms-flexbox
  display flex
  -webkit-box-pack center
  -ms-flex-pack center
  justify-content center
  -webkit-box-align center
  -ms-flex-align center
  align-items center
  color #fff
  img
    width 100%
    border-radius 50%

.nav-title
  font-size 16px
  margin-top 16px
  color #eee

.pull-right
  float right

// animation
.fade-transition {
  transition all .5s ease
  opacity 1
}

.fade-enter, .fade-leave {
  opacity 0
}

.bounce-enter {
  animation: bounce-in .5s;
}
.bounce-leave {
  animation: bounce-out .5s;
}
@keyframes bounce-in {
  0% {
    transform: translate(100%, 0)
    opacity 0.3
  }
  50% {
    transform: translate(-12%, 0)
  }
  100% {
    transform: translate(0, 0)
    opacity 1
  }
}
@keyframes bounce-out {
  0% {
    transform: translate(0, 0)
    opacity 1
  }
  50% {
    transform: translate(-12%, 0)
  }
  100% {
    transform: translate(100%, 0)
    opacity 0.3
  }
}

// fix
.vc-nav-menu-content
  display block
</style>
