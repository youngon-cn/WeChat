<template lang="pug">
#person.vc-page
  scroll-view(v-touch:swiperight="back()", v-touch:swipeleft="forward()", v-el:person)
    icon-button(icon="arrow_back", v-link="{path: '/forum'}")
    .person-info(:style="{ backgroundImage: 'url(' + user.headimgurl + ')' }")
      .person-bg(:style="{ backgroundImage: 'url(' + user.headimgurl + ')' }")
      img.person-headImg(:src="user.headimgurl", v-show="user.nickname", transition="fade")
      .person-nickname(v-show="user.nickname", transition="fade")
        span {{user.nickname}}
        span.person-info-fresh
          icon(value="refresh", :size="20", @click="freshInfo()")
    .person-posts
      tab-bar(:active="tabActive", @tab-change="tabBarClick")
        tab-bar-item 最近回复
        tab-bar-item 最新发布
        tab-bar-item 我的收藏
      .vc-refresh-control(v-show="refreshing", transition="fade")
        circular(:size="20", :border-width="2")
      list(v-show="tabActive === 0")
        item(v-for="post in postList.a", v-link="{path: '/forum/detail/' + post._id + '?index=' + $index}", track-by="_id", transition="bounce")
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
      list(v-show="tabActive === 1")
        item(v-for="post in postList.b", v-link="{path: '/forum/detail/' + post._id + '?index=' + $index}", track-by="_id", transition="bounce")
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
      list(v-show="tabActive === 2")
        item(v-for="post in postList.c", v-link="{path: '/forum/detail/' + post._id + '?index=' + $index}", track-by="_id", transition="bounce")
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
    infinite-scroll(@load="getNextPagePosts(tabActive)", :trigger="$els.person", v-if="false")
</template>

<script>
import { getUser, toogleRefreshing, toast } from 'vx/actions'
import { user, refreshing } from 'vx/getters'
import moment from 'moment'
moment.locale('zh-cn')

export default {
  attached () {
    this.getFirstPagePosts(this.tabActive)
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
    forward () {
      window.history.go(1)
    },
    tabBarClick (index) {
      this.tabActive = index
      this.postList = {
        a: [],
        b: [],
        c: []
      }
      this.getFirstPagePosts(index)
    },
    getFirstPagePosts (type) {
      if (type === 0) {
        this.toogleRefreshing()
        this.$http
          .get('/request/forum/posts/reply/firstPage?commenter=' + this.$route.params.pid || this.user._id)
          .then((data) => {
            this.toogleRefreshing()
            this.postList.a = data.body
          }, (err) => {
            this.toogleRefreshing()
            console.log(err)
          })
      } else if (type === 1) {
        this.toogleRefreshing()
        this.$http
          .get('/request/forum/posts/firstPage?type=9&poster=' + this.$route.params.pid || this.user._id)
          .then((data) => {
            this.toogleRefreshing()
            this.postList.b = data.body
          }, (err) => {
            this.toogleRefreshing()
            console.log(err)
          })
      } else if (type === 2) {
        this.toogleRefreshing()
        this.$http
          .get('/request/forum/user/favorites')
          .then((data) => {
            this.toogleRefreshing()
            if (data.body.state === 1) {
              this.postList.c = data.body.favorites
            }
          }, (err) => {
            this.toogleRefreshing()
            console.log(err)
          })
      }
    },
    getNextPagePosts (type) {
      if (type === 0) {
        if (this.postList.a.length % 10 !== 0) return
        this.$http
          .get('/request/forum/posts/reply/nextPage?updateDate=' + this.postList.a[this.postList.a.length - 1].updateDate + '&commenter=' + this.$route.params.pid || this.user._id)
          .then((data) => {
            for (let post of data.body) {
              this.postList.a.push(post)
            }
          }, (err) => {
            console.log(err)
          })
      } else if (type === 1) {
        if (this.postList.b.length % 10 !== 0) return
        this.$http
          .get('/request/forum/posts/nextPage?updateDate=' + this.postList.b[this.postList.b.length - 1].updateDate + '&type=9&poster=' + this.$route.params.pid || this.user._id)
          .then((data) => {
            for (let post of data.body) {
              this.postList.b.push(post)
            }
          }, (err) => {
            console.log(err)
          })
      }
    },
    freshInfo () {
      this.$http
        .get('/request/forum/wxoauth?type=fresh')
        .then((data) => {
          if (data.body.state === 1) {
            this.getUser()
            this.toast('数据更新成功')
          } else if (data.body.turnUrl) {
            window.location.href = data.body.turnUrl
          }
        }, (err) => {
          this.toast('数据更新失败，请稍后再试')
          console.log(err)
        })
    },
    moment (date) {
      return moment(date)
    }
  },
  vuex: {
    actions: {
      getUser,
      toogleRefreshing,
      toast
    },
    getters: {
      user,
      refreshing
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
.person-bg
  width 100%
  height 100%
  filter blur(16px)
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
