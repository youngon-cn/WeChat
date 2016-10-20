<template lang="pug">
#admin
  .vc-page
    header-bar
      icon-button(slot="left", icon="menu", @click="showNav()")
      slot(name="header")
    content
      slot(name="content")
  slot(name="plug")
  nav-drawer(:show.sync="navShow")
    .nav-icon-logo(slot="header") Y
    .nav-title(slot="header") 微信历史消息管理后台
    nav-menu-header 信息管理
    nav-menu(@click="closeNav()", icon="bubble_chart", v-link="{path: '/ygadmin/history/article/upload'}", title="文章上传")
    nav-menu(@click="closeNav()", icon="pages", v-link="{path: '/ygadmin/history/article/manage'}", title="文章管理")
    nav-menu(@click="closeNav()", icon="photo", v-link="{path: '/ygadmin/history/banner/upload'}", title="轮换图上传")
    nav-menu(@click="closeNav()", icon="burst_mode", v-link="{path: '/ygadmin/history/banner/manage'}", title="轮换图管理")
    nav-divider
    nav-menu(@click="closeNav()", icon="info_outline", v-link="{path: '/'}", title="回主界面")
</template>

<script>
export default {
  data () {
    return {
      navShow: false
    }
  },
  methods: {
    showNav () {
      this.navShow = true
    },
    closeNav (title) {
      this.navShow = false
    }
  }
}
</script>

<style lang="stylus">
.nav-icon-logo
  width 80px
  height 80px
  background-color #bbbfc4
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
  border-radius 50%

.nav-title
  font-size 16px
  margin-top 16px
  color #eee
</style>
