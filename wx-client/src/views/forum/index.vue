<template lang="pug">
#forum.vc-page
  header-bar
    icon-button(slot="left", icon="menu", @click="showNav()")
    span VOD反馈专区
  content
    list
      item(ripple, v-link="{path: '/forum/detail/' + post._id}", v-for="post in posts")
        item-media.headImg
          img(:src="post.poster.headimgurl")
        item-content.content
          item-title-row
            item-title {{post.title}}
          item-title-row
            item-title.sub-title {{post.poster.nickname}}
            item-title-after ({{post.comments.length}}/{{post.pv}})
          item-title-row
            item-title.sub-title 创建于： {{moment(post.postDate).format('YYYY-MM-DD hh:mm:ss')}}
            item-title-after {{moment(post.postDate).fromNow()}}
    float-button(style="right: 20px; bottom: 20px; z-index: 99", fixed, color="red", icon="mode_edit", v-link="{path: '/forum/publish'}")
  nav-drawer(:show.sync="navShow")
    .nav-icon-logo(slot="header")
      img(:src="user.headimgurl")
    .nav-title(slot="header") {{user.nickname}}
    nav-menu(@click="closeNav()", icon="bubble_chart", v-link="{path: '/history'}", title="技术贴")
    nav-divider
    nav-menu(@click="closeNav()", icon="info_outline", title="关于")
</template>

<script>
import { getUserInfo } from '../../vuex/getters'
import moment from 'moment'
moment.locale('zh-cn')

export default {
  attached () {
    this.getPosts()
  },
  data () {
    return {
      posts: [],
      navShow: false
    }
  },
  methods: {
    getPosts () {
      this.$http
        .get('/request/forum/posts')
        .then((data) => {
          this.posts = data.body
        }, (err) => {
          console.log(err)
        })
    },
    showNav () {
      this.navShow = true
    },
    closeNav (title) {
      this.navShow = false
    },
    moment (date) {
      return moment(date)
    }
  },
  vuex: {
    getters: {
      user: getUserInfo
    }
  }
}
</script>

<style lang="stylus">
.headImg
  float left
  width 80px
  height 100px

.headImg > img
  max-width 80px

#forum .vc-item-title-row
  margin 1px 0

.sub-title
  font-size 14px

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
</style>