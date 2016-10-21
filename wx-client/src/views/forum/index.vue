<template lang="pug">
#forum.vc-page
  header-bar
    icon-button(slot="left", icon="menu", @click="showNav()")
    span VOD反馈专区
  content(v-el:post_list)
    refresh-control(@refresh="getNewPosts(posts[0]._id)", :trigger="$els.post_list", :refreshing="refreshing")
    list
      item(v-link="{path: '/forum/detail/' + post._id}", v-for="post in posts")
        item-media.headImg
          img(:src="post.poster.headimgurl")
        item-content.content
          item-title-row
            item-title {{post.title}}
          item-title-row
            item-title.sub-title {{post.poster.nickname}}
            item-title-after ({{post.comments.length}}/{{post.pv}})
          item-title-row
            item-title.sub-title 创建于：{{moment(post.postDate).format('YYYY-MM-DD hh:mm:ss')}}
            item-title-after {{moment(post.postDate).fromNow()}}
    infinite-scroll(@load="getNextPagePosts(posts[posts.length-1]._id)", :trigger="$els.post_list", :loading="loading")
    float-button(style="right: 20px; bottom: 20px; z-index: 99", fixed, color="red", icon="mode_edit", v-link="{path: '/forum/publish'}")
  nav-drawer(:show.sync="navShow", v-if="user.nickname")
    .nav-icon-logo(slot="header")
      img(:src="user.headimgurl")
    .nav-title(slot="header") {{user.nickname}}
    nav-menu(@click="closeNav()", icon="bubble_chart", v-link="{path: '/history'}", title="技术贴")
    nav-divider
    nav-menu(@click="closeNav()", icon="info_outline", title="关于")
</template>

<script>
import { getNewPosts, getFirstPagePosts, getNextPagePosts, toogleLoading } from '../../vuex/actions'
import { user, refreshing, loading, posts } from '../../vuex/getters'
import moment from 'moment'
moment.locale('zh-cn')

export default {
  ready () {
    this.getFirstPagePosts()
  },
  data () {
    return {
      navShow: false
    }
  },
  methods: {
    showNav () {
      this.navShow = true
    },
    closeNav () {
      this.navShow = false
    },
    moment (date) {
      return moment(date)
    },
    loadMore () {
      this.toogleLoading()
      setTimeout(() => {
        this.toogleLoading()
      }, 1000)
    }
  },
  vuex: {
    actions: {
      getNewPosts,
      getFirstPagePosts,
      getNextPagePosts,
      toogleLoading
    },
    getters: {
      user,
      posts,
      refreshing,
      loading
    }
  }
}
</script>

<style lang="stylus">
.headImg
  float left
  width 70px
  height 100px

.headImg > img
  max-width 70px
  margin 5px 0

#forum
  .vc-item-title-row
    margin 1px 0
  .vc-list
    margin 0

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

.vc-item-media+.vc-item-content
  padding-left 8px
</style>