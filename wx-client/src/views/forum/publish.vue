<template lang="pug">
#publish.vc-page
  header-bar
    icon-button(slot="left", v-link="{path: '/forum'}", icon="arrow_back")
    span 发布帖子
  content
    form-list
      text-field(label-float, label="帖子标题", icon="title", :value.sync="title")
      text-field(label-float, label="帖子内容（可留空）", icon="subject", type="textarea", :rows="4", :value.sync="content")
  float-button(style="right: 20px; bottom: 20px; z-index: 99", fixed, color="red", icon="check", @click="publish")
</template>

<script>
import { toast, getFirstPagePosts, scrollInit, setPostsType } from '../../vuex/actions'
import { posts } from '../../vuex/getters'

export default {
  data () {
    return {
      title: '',
      content: ''
    }
  },
  methods: {
    publish () {
      if (!this.title) {
        return this.toast('请输入标题')
      }
      this.$http
        .post('/request/forum/post', {
          title: this.title,
          content: this.content
        })
        .then((data) => {
          if (data.body.turnUrl) {
            return (window.location.href = data.body.turnUrl)
          }
          if (data.body.state === 1) {
            this.toast('发布成功')
            setTimeout(() => {
              this.title = ''
              this.content = ''
              this.setPostsType(9)
              this.getFirstPagePosts(9)
              this.scrollInit()
              window.history.go(-1)
            }, 500)
          }
        }, (err) => {
          console.log(err)
        })
    }
  },
  vuex: {
    actions: {
      toast,
      getFirstPagePosts,
      scrollInit,
      setPostsType
    },
    getters: {
      posts
    }
  }
}
</script>

<style lang="stylus">
#publish
  .headImg
    float left
    width 80px
    height 100px
  .headImg > img
    max-width 80px
  .sub-title
    font-size 14px
</style>
