<template lang="pug">
#detail.vc-page
  header-bar
    icon-button(slot="left", @click="back()", icon="arrow_back")
    span 帖子详情
  content
    .post
      h2.post-title {{post.title}}
      .post-info
        img(:src="post.poster.headimgurl")
        .post-info-text
          p {{post.poster.nickname}}
          p 三天前创建·10次浏览
      p 无详情
    .comments
      h3(v-if="post.comments.length") {{post.comments.length}}条回复
      h3(v-else) 还没有人回复
      list
        item(v-for="comment in post.comments")
          item-media
            img.comment-headImg(:src="comment.commenter.headimgurl")
          item-content
            item-title-row
              item-title {{comment.commenter.nickname}}
              item-title-after
                icon(value="comment", @click="tooglePopup()")
            item-text.comment-text {{comment.content}}
  float-button(style="right: 20px; bottom: 20px; z-index: 99", fixed, color="red", icon="comment", @click="tooglePopup()", v-el:button)
  popup.comment-popup(position="bottom", :show.sync="show")
    .comment-bar
      span 回复帖子
      icon.comment-operat(value="done", @click="postComment()")
      icon.comment-operat(value="close", @click="tooglePopup()")
    textarea.comment-form(v-model="comment")
</template>

<script>
import { toast } from '../../vuex/actions'

export default {
  attached () {
    this.getPost()
    this.post = {
      poster: {},
      comments: []
    }
  },
  data () {
    return {
      show: false,
      post: {
        poster: {},
        comments: []
      },
      comment: ''
    }
  },
  methods: {
    back () {
      window.history.go(-1)
    },
    tooglePopup () {
      if (this.show) this.comment = ''
      this.show = !this.show
    },
    getPost () {
      this.$http
        .get('/request/forum/post?postId=' + this.$route.params.pid)
        .then((data) => {
          this.post = data.body
        }, (err) => {
          console.log(err)
        })
    },
    postComment () {
      this.$http
        .post('/request/forum/comment', {
          comment: this.comment,
          postId: this.$route.params.pid
        })
        .then((data) => {
          this.toast('回复成功')
          this.getPost()
          this.tooglePopup()
        }, (err) => {
          console.log(err)
        })
    }
  },
  vuex: {
    actions: {
      toast
    }
  }
}
</script>

<style lang="stylus">
.post
  padding 4px 18px
.post-title
  margin 10px 0
.post-info
  overflow hidden
  margin 4px 0
.post-info img
  width 60px
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
.comments>h3
  padding 10px 18px
  margin 0
  border-top 10px solid #eee
#detail .vc-list
  margin 0
.comment-headImg
  width 40px
  border-radius 50%
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