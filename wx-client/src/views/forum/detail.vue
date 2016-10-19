<template lang="pug">
#detail.vc-page
  header-bar
    icon-button(slot="left", @click="back()", icon="arrow_back")
    span 帖子详情
  content
    .post
      h2.post-title 爸爸去哪儿4
      .post-info
        img(src="http://i1.17173cdn.com/9ih5jd/YWxqaGBf/forum/images/2013/10/16/174233sqpqp7zt7o71qu73.png")
        .post-info-text
          p 柴茂源
          p 三天前创建·10次浏览
      p 无详情
    .comments
      h3 12条回复
      list
        item
          item-media
            img.comment-headImg(src="http://i1.17173cdn.com/9ih5jd/YWxqaGBf/forum/images/2013/10/16/174233sqpqp7zt7o71qu73.png")
          item-content
            item-title-row
              item-title F-loat
              item-title-after
                icon(value="comment")
            item-text.comment-text 啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联
        item
          item-media
            img.comment-headImg(src="http://i1.17173cdn.com/9ih5jd/YWxqaGBf/forum/images/2013/10/16/174233sqpqp7zt7o71qu73.png")
          item-content
            item-title-row
              item-title F-loat
              item-title-after
                icon(value="comment")
            item-text.comment-text 啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联
        item
          item-media
            img.comment-headImg(src="http://i1.17173cdn.com/9ih5jd/YWxqaGBf/forum/images/2013/10/16/174233sqpqp7zt7o71qu73.png")
          item-content
            item-title-row
              item-title F-loat
              item-title-after
                icon(value="comment")
            item-text.comment-text 啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联啦啦啦阿联
  float-button(style="right: 20px; bottom: 20px; z-index: 99", fixed, color="red", icon="comment", @click="tooglePopup()", v-el:button)
  popup.comment-popup(position="bottom", :show.sync="show")
    .comment-bar
      span 回复帖子
      icon.comment(value="done", @click="tooglePopup()")
    textarea.comment-form
</template>

<script>
export default {
  data () {
    return {
      show: false
    }
  },
  methods: {
    back () {
      window.history.go(-1)
    },
    tooglePopup () {
      this.show = !this.show
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
  -webkit-box-pack justify
  -ms-flex-pack justify
  justify-content space-between
  background-color #474a4f
  font-size 16px
  height 48px
  display -webkit-box
  display -ms-flexbox
  display flex
  -webkit-box-align center
  -ms-flex-align center
  align-items center
  color #fff
  padding-left 10px
.comment
  padding-right 10px
</style>