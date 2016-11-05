<template lang="pug">
#detail.vc-page
  header-bar
    icon-button(slot="left", v-link="{path: '/forum'}", icon="arrow_back")
    span 帖子详情
  content(v-el:post_detail)
    .vc-refresh-control(v-show="refreshing", transition="fade")
      circular(:size="20", :border-width="2")
    .post(v-show="post.title", transition="fade")
      .post-title
        h2 {{post.title}}
        span.post-state(v-if="post.type === 0") 未处理
        span.post-state(v-if="post.type === 1") 连载中
        span.post-state(v-if="post.type === 2") 已上传
        span.post-state(v-if="post.type === -1") 禁止上传
      icon.post-operate(value="menu", @click="toogleAction()", v-if="user.type === 9 && post.type !== -1 && post.type !== 2")
      .post-info
        img(:src="post.poster.headimgurl")
        .post-info-text
          p
            span {{post.poster.nickname}}
            span(v-if="post.poster.type === 9")
              img.youngon(src="../../assets/youngon.png")
          p {{moment(post.postDate).fromNow()}}创建·{{post.pv}}次浏览
      p(v-if="post.content") {{post.content}}
      p(v-else) 无详情
      .plantform(v-if="post.plantform.length")
        h4 资源在播平台：
        span(v-for="plantform in post.plantform") {{plantform}}
    .comments(v-show="post.title", transition="fade")
      h3(v-if="post.nc") {{post.nc}}条回复
      h3(v-else) 还没有人回复
      list
        item(v-for="comment in post.comments", transition="fade", stagger="100", track-by="_id")
          item-media
            img.comment-headImg(:src="comment.commenter.headimgurl")
          item-content
            item-title-row
              item-title
                span {{comment.commenter.nickname}}
                span(v-if="comment.commenter.type === 9")
                  img.youngon(src="../../assets/youngon.png")
                span.comment-date {{moment(comment.commentDate).fromNow()}}
              item-title-after
                icon(value="comment", @click="tooglePopup(comment.commenter._id, '@'+comment.commenter.nickname)")
            item-text.comment-text
              span.comment-to(v-if="comment.to") @{{comment.to.nickname}}
              span {{comment.content}}
  float-button(v-show="user.openid", transition="fade", style="right: 20px; bottom: 20px; z-index: 99", fixed, color="red", icon="comment", @click="tooglePopup()", v-el:button)
  popup.comment-popup(position="bottom", :show.sync="popup.show")
    .comment-bar
      span 回复帖子
      icon.comment-operat(value="done", @click="postComment()")
      icon.comment-operat(value="close", @click="tooglePopup()")
    textarea.comment-form(v-model="comment", :placeholder="to.nickname")
  action-sheet(:actions="actionSheet.actions", :show.sync="actionSheet.show")
</template>

<script>
import { toast, postsUpdate, toogleRefreshing } from '../../vuex/actions'
import { user, refreshing } from '../../vuex/getters'
import moment from 'moment'
moment.locale('zh-cn')

export default {
  attached () {
    this.getPost('init')
    this.popup.show = false
  },
  detached () {
    this.post = {
      poster: {},
      comments: [],
      plantform: []
    }
  },
  data () {
    return {
      popup: {
        show: false
      },
      post: {
        poster: {},
        comments: [],
        plantform: []
      },
      comment: '',
      to: {
        _id: '',
        nickname: ''
      },
      actionSheet: {
        show: false,
        actions: []
      }
    }
  },
  methods: {
    tooglePopup (_id, nickname) {
      this.to = {
        _id: _id || '',
        nickname: nickname || ''
      }
      if (this.popup.show) this.comment = ''
      this.popup.show = !this.popup.show
    },
    toogleAction () {
      this.actionSheet.show = !this.actionSheet.show
    },
    getPost (type) {
      this.toogleRefreshing()
      this.$http
        .get('/request/forum/post?postId=' + this.$route.params.pid + '&type=' + type)
        .then((data) => {
          this.toogleRefreshing()
          this.post = data.body
          this.actionSheet.actions = []
          if (type === 'init') {
            if (this.post.type === 0) {
              this.actionSheet.actions.push({
                name: '标记连载中',
                click: () => {
                  this.operate(1)
                }
              })
              this.actionSheet.actions.push({
                name: '标记已上传',
                click: () => {
                  this.operate(2)
                }
              })
              this.actionSheet.actions.push({
                color: 'red',
                name: '标记禁止上传',
                click: () => {
                  this.operate(-1)
                }
              })
            }
            if (this.post.type === 1) {
              this.actionSheet.actions.push({
                name: '标记连载完毕',
                click: () => {
                  this.operate(2)
                }
              })
            }
          }
        }, (err) => {
          this.toogleRefreshing()
          console.log(err)
        })
    },
    postComment () {
      if (!this.comment) {
        return this.toast('请输入评论内容')
      }
      this.$http
        .post('/request/forum/comment', {
          content: this.comment,
          postId: this.$route.params.pid,
          to: this.to._id
        })
        .then((data) => {
          if (data.body.turnUrl) {
            return (window.location.href = data.body.turnUrl)
          }
          if (data.body.state === 1) {
            this.toast('回复成功')
            this.getPost('fresh')
            this.postsUpdate(this.$route.query.index)
            this.tooglePopup()
          }
        }, (err) => {
          console.log(err)
        })
    },
    moment (date) {
      return moment(date)
    },
    operate (type) {
      this.$http
        .post('/request/forum/post/operate', {
          type: type,
          postId: this.$route.params.pid
        })
        .then((data) => {
          if (data.body.state === 1) {
            this.toast('操作成功')
            this.getPost('fresh')
            this.postsUpdate(this.$route.query.index, type)
          } else {
            this.toast('操作失败，请稍后重试')
          }
        }, (err) => {
          console.log(err)
        })
    }
  },
  vuex: {
    actions: {
      toast,
      postsUpdate,
      toogleRefreshing
    },
    getters: {
      user,
      refreshing
    }
  }
}
</script>

<style lang="stylus">
.post
  padding 4px 18px
.post-title
  margin 10px 0
  min-height 31px
  float left
  width 90%
.post-title>h2
  display inline
  margin 0
.post-state
  text-align center
  font-size 12px
  background-color #efefef
  border-radius 15px
  padding 2px 6px
  margin-left 6px
.post-operate
  margin 13px 0
  float right
.post-info
  clear both
  overflow hidden
  margin 4px 0
.post-info>img
  width 60px
  height 60px
  float left
  border-radius 50%
.post-info-text
  float left
  padding 6px
.post-info-text>p:first-child
  color #222
.post-info p
  margin 0
  line-height 24px
.plantform
  padding 4px 6px
  margin 6px 0
  background-color #efefef
  border-left 4px solid #ccc
.plantform
  h4
    margin 0
  span
    margin-right 8px
.comments>h3
  padding 10px 18px
  margin 0
  border-top 10px solid #eee
#detail .vc-list
  margin 0 0 60px 0
.comment-headImg
  width 40px
  height 40px
  border-radius 50%
.comment-date
  margin 0 6px
  color #7e848c
  font-size 12px
.comment-to
  margin-right 4px
  color #08c
.comment-text
  display block
  max-height none
.comment-popup
  width 100%
.comment-form
  padding 10px 16px
  width 100%
  height 160px
  color #7e848c
.comment-bar
  width 100%
  background-color #474a4f
  font-size 16px
  height 48px
  line-height 48px
  color #fff
  padding-left 10px
.comment-operat
  float right
  line-height 48px
  padding-right 10px
</style>
