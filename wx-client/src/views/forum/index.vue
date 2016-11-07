<template lang="pug">
#forum.vc-page
  header-bar
    icon-button(slot="left", icon="menu", @click="toogleNav()")
    span VOD反馈专区
  content(v-el:post_list, v-touch:swiperight="toogleNav('open')", v-touch:swipeleft="forward()")
    .vc-refresh-control(v-show="refreshing", transition="fade")
      circular(:size="20", :border-width="2")
    list
      item(v-link="{path: '/forum/' + post._id + '?index=' + $index}", v-for="post in posts", @click="goToDetail($index, $els.post_list.scrollTop)", track-by="_id", transition="bounce")
        item-media.headImg
          p(v-if="post.type === 0") 未处理
          p(v-if="post.type === 1") 连载中
          p(v-if="post.type === 2") 已上传
          p(v-if="post.type === -1", style="margin: 7px 0") 禁止上传
          img(:src="post.poster.headimgurl")
        item-content
          item-title-row
            item-title {{post.title}}
            item-title-after(v-if="user.type === 9")
              icon(value="delete_forever", :size="20", @click.prevent.stop="delPost(post._id, $index)")
          item-title-row
            item-title.sub-title
              span {{post.poster.nickname}}
              span(v-if="post.poster.type === 9")
                img.youngon(src="../../assets/youngon.png")
            item-title-after ({{post.nc}}/{{post.pv}})
          item-title-row
            item-title.sub-title 创建于：{{moment(post.postDate).format('YYYY-MM-DD HH:mm:ss')}}
            item-title-after {{moment(post.postDate).fromNow()}}
    infinite-scroll(@load="getNextPagePosts(posts[posts.length-1], postsType)", :trigger="$els.post_list", :loading="loading")
    float-button(v-show="user.nickname", transition="fade", style="right: 20px; bottom: 20px; z-index: 99", fixed, color="red", icon="mode_edit", v-link="{path: '/forum/publish'}")
  overlay(v-if="navShow")
  nav-drawer(:overlay="false", :show.sync="navShow", v-touch:swipeleft="toogleNav('close')")
    .nav-icon-logo(slot="header", v-link="{path: '/forum/person/' + user._id}")
      img(:src="user.headimgurl")
    .nav-title(slot="header") {{user.nickname}}
    nav-menu-header 分类
    nav-menu(@click="switchType(9)", icon="sentiment_satisfied", title="全部")
    nav-menu(@click="switchType(0)", icon="sentiment_dissatisfied", title="未处理")
    nav-menu(@click="switchType(2)", icon="sentiment_very_satisfied", title="已上传")
    nav-menu(@click="switchType(-1)", icon="sentiment_very_dissatisfied", title="禁止上传")
    nav-divider
    nav-menu(@click="about()", icon="info_outline", title="关于")
  confirm(:title="confirm.title", show-icon, @sure="handlerSure()", :show.sync="confirm.show", :msg="confirm.msg")
</template>

<script>
import { getFirstPagePosts, getNextPagePosts, goToDetail, setPostsType, toast, alert } from '../../vuex/actions'
import { user, refreshing, loading, posts, postsType, scrollTop } from '../../vuex/getters'
import moment from 'moment'
moment.locale('zh-cn')

export default {
  ready () {
    this.getFirstPagePosts(this.postsType)
  },
  attached () {
    this.$els.post_list.scrollTop = this.scrollTop
  },
  data () {
    return {
      navShow: false,
      confirm: {
        msg: '',
        show: false
      }
    }
  },
  methods: {
    forward () {
      window.history.go(1)
    },
    toogleNav (type) {
      var ua = navigator.userAgent.toLowerCase()
      var isWeixin = ua.indexOf('micromessenger') !== -1
      if (!isWeixin) {
        this.toast('请在微信中使用')
        return
      }
      if (type === 'open') {
        this.navShow = true
        return
      }
      if (type === 'close') {
        this.navShow = false
        return
      }
      this.navShow = !this.navShow
    },
    moment (date) {
      return moment(date)
    },
    switchType (type) {
      this.setPostsType(type)
      this.navShow = false
      setTimeout(() => this.getFirstPagePosts(type), 500)
    },
    delPost (_id, index) {
      this.confirm = {
        msg: '确认删除？',
        show: true
      }
      this.handlerSure = () => {
        this.$http
          .delete('/request/forum/post?postId=' + _id)
          .then((data) => {
            if (data.body.state === 1) {
              this.posts.splice(index, 1)
            } else {
              this.toast('删除失败，请稍后重试')
            }
          }, (err) => {
            console.log(err)
          })
      }
    },
    about () {
      this.toogleNav()
      setTimeout(() => {
        this.alert('关于', 'copyright©阳光网站', 'info')
      }, 400)
    }
  },
  vuex: {
    actions: {
      getFirstPagePosts,
      getNextPagePosts,
      goToDetail,
      setPostsType,
      toast,
      alert
    },
    getters: {
      user,
      posts,
      postsType,
      refreshing,
      loading,
      scrollTop
    }
  }
}
</script>

<style lang="stylus">
</style>
