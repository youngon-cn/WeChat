<template lang="pug">
#publish.vc-page
  header-bar
    icon-button(slot="left", @click="back()", icon="arrow_back")
    span 发布帖子
  content
    form-list
      text-field(label-float, label="帖子标题", icon="title")
      text-field(label-float, label="帖子内容", icon="subject", type="textarea", :rows="4")
  float-button(style="right: 20px; bottom: 20px; z-index: 99", fixed, color="red", icon="check", v-link="{path: '/forum/publish'}")
</template>

<script>
export default {
  methods: {
    back () {
      window.history.back()
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
.sub-title
  font-size 14px
</style>