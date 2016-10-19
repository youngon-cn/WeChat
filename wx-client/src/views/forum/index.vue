<template lang="pug">
#forum.vc-page
  header-bar VOD反馈专区
  content
    list
      item(ripple, v-link="{path: '/forum/detail/555'}")
        item-media.headImg
          img(src="http://i1.17173cdn.com/9ih5jd/YWxqaGBf/forum/images/2013/10/16/174233sqpqp7zt7o71qu73.png")
        item-content.content
          item-title-row
            item-title 爸爸去哪儿4
          item-title-row
            item-title.sub-title 柴茂源
            item-title-after (25/140)
          item-title-row
            item-title.sub-title 创建于： 2014-12-23 17:14:04
            item-title-after 三天前
    float-button(style="right: 20px; bottom: 20px; z-index: 99", fixed, color="red", icon="mode_edit", v-link="{path: '/forum/publish'}")
</template>

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
</style>