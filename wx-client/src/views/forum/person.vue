<template lang="pug">
#person.vc-page
  content(v-touch:swiperight="back()")
    icon-button(icon="arrow_back", v-link="{path: '/forum'}")
    .person-info
      .person-bg
      img.person-headImg(:src="user.headimgurl", v-show="user.nickname", transition="fade")
      .person-nickname(v-show="user.nickname", transition="fade")
        span {{user.nickname}}
        span.person-info-fresh
          icon(value="refresh", :size="20", @click="freshInfo()")
    .person-posts
      tab-bar(:active="tabActive")
        tab-bar-item(@tabbar-click="tabBarClick") 最近回复
        tab-bar-item(@tabbar-click="tabBarClick") 最新发布
        tab-bar-item(@tabbar-click="tabBarClick") 我的收藏
      .vc-refresh-control(v-show="refreshing", transition="fade")
        circular(:size="20", :border-width="2")
      list(v-if="tabActive === 0")
        item(v-for="post in postList.a", v-link="{path: '/forum/' + post._id + '?index=' + $index}", @click="goToDetail($index, $els.post_list.scrollTop)", track-by="_id", transition="bounce")
          item-media.headImg
            p(v-if="post.type === 0") 未处理
            p(v-if="post.type === 1") 连载中
            p(v-if="post.type === 2") 已上传
            p(v-if="post.type === -1", style="margin: 7px 0") 禁止上传
            img(:src="post.poster.headimgurl")
          item-content
            item-title-row
              item-title {{post.title}}
            item-title-row
              item-title.sub-title
                span {{post.poster.nickname}}
                span(v-if="post.poster.type === 9")
                  img.youngon(src="../../assets/youngon.png")
              item-title-after ({{post.nc}}/{{post.pv}})
            item-title-row
              item-title.sub-title 创建于：{{moment(post.postDate).format('YYYY-MM-DD HH:mm:ss')}}
              item-title-after {{moment(post.postDate).fromNow()}}
      list(v-if="tabActive === 1")
        item(v-for="post in postList.b", v-link="{path: '/forum/' + post._id + '?index=' + $index}", @click="goToDetail($index, $els.post_list.scrollTop)", track-by="_id", transition="bounce")
          item-media.headImg
            p(v-if="post.type === 0") 未处理
            p(v-if="post.type === 1") 连载中
            p(v-if="post.type === 2") 已上传
            p(v-if="post.type === -1", style="margin: 7px 0") 禁止上传
            img(:src="post.poster.headimgurl")
          item-content
            item-title-row
              item-title {{post.title}}
            item-title-row
              item-title.sub-title
                span {{post.poster.nickname}}
                span(v-if="post.poster.type === 9")
                  img.youngon(src="../../assets/youngon.png")
              item-title-after ({{post.nc}}/{{post.pv}})
            item-title-row
              item-title.sub-title 创建于：{{moment(post.postDate).format('YYYY-MM-DD HH:mm:ss')}}
              item-title-after {{moment(post.postDate).fromNow()}}
      list(v-if="tabActive === 2")
        item(v-for="post in postList.c", v-link="{path: '/forum/' + post._id + '?index=' + $index}", @click="goToDetail($index, $els.post_list.scrollTop)", track-by="_id", transition="bounce")
          item-media.headImg
            p(v-if="post.type === 0") 未处理
            p(v-if="post.type === 1") 连载中
            p(v-if="post.type === 2") 已上传
            p(v-if="post.type === -1", style="margin: 7px 0") 禁止上传
            img(:src="post.poster.headimgurl")
          item-content
            item-title-row
              item-title {{post.title}}
            item-title-row
              item-title.sub-title
                span {{post.poster.nickname}}
                span(v-if="post.poster.type === 9")
                  img.youngon(src="../../assets/youngon.png")
              item-title-after ({{post.nc}}/{{post.pv}})
            item-title-row
              item-title.sub-title 创建于：{{moment(post.postDate).format('YYYY-MM-DD HH:mm:ss')}}
              item-title-after {{moment(post.postDate).fromNow()}}
</template>

<script>
import { goToDetail } from '../../vuex/actions'
import { user } from '../../vuex/getters'
import moment from 'moment'
moment.locale('zh-cn')

export default {
  attached () {
    this.getFirstPagePosts()
  },
  data () {
    return {
      tabActive: 0,
      postList: {
        a: [],
        b: [],
        c: []
      }
    }
  },
  methods: {
    back () {
      window.history.go(-1)
    },
    tabBarClick (index) {
      this.tabActive = index
    },
    getFirstPagePosts () {
      this.$http
        .get('/request/forum/posts/firstPage?type=9&poster=' + this.$route.params.pid || this.user._id)
        .then((data) => {
          this.postList.b = data.body
        }, (err) => {
          console.log(err)
        })
    },
    freshInfo () {
      this.$http
        .get('/request/forum/wxoauth?type=fresh')
        .then((data) => {
          if (data.body.turnUrl) {
            return (window.location.href = data.body.turnUrl)
          }
        }, (err) => {
          console.log(err)
        })
    },
    moment (date) {
      return moment(date)
    }
  },
  vuex: {
    actions: {
      goToDetail
    },
    getters: {
      user
    }
  }
}
</script>

<style lang="stylus">
#person
  .vc-icon-button
    position absolute
    top 4px
    left 8px
    z-index 9
    color #fff
    font-size 24px
    opacity .7

.person-info
  position relative
  height 180px
  background-image url('https://wx.qlogo.cn/mmopen/3U8ibtT2vYC9aJsRxpiccQpQ1PWf52kyoaT9xSlvcuvwZOdxMibadyYt5V6f82ZkH3an9De2ux8GzHxWlmE8ic3e0FW1fDdWNUwK/0')
.person-bg
  width 100%
  height 100%
  filter blur(16px)
  background-image url('https://wx.qlogo.cn/mmopen/3U8ibtT2vYC9aJsRxpiccQpQ1PWf52kyoaT9xSlvcuvwZOdxMibadyYt5V6f82ZkH3an9De2ux8GzHxWlmE8ic3e0FW1fDdWNUwK/0')
  background-size cover
  background-repeat no-repeat
  background-position center center
.person-headImg
  border-radius 50%
  width 90px
  height 90px
  position absolute
  left 50%
  transform translate(-50%,0)
  top 26px
.person-nickname
  position absolute
  left 50%
  transform translate(-50%,0)
  bottom 26px
  font-size 16px
  color #efefef
.person-info-fresh
  position relative
  .icon
    position absolute
    top 0
</style>
