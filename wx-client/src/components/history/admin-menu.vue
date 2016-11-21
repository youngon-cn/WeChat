<template lang="pug">
#admin
  .vc-page
    header-bar
      icon-button(slot="left", icon="menu", @click="toogleNav()")
      slot(name="header")
    scroll-view
      .vc-refresh-control(v-show="refreshing", transition="fade")
        circular(:size="20", :border-width="2")
      slot(name="content")
  slot(name="plug")
  nav-drawer(v-if="user.type === 9", :show.sync="navShow")
    .nav-icon-logo(slot="header")
      img(:src="user.headimgurl")
    .nav-title(slot="header") {{user.nickname}}
    nav-menu-header 信息管理
    nav-menu(@click="toogleNav()", icon="bubble_chart", v-link="{path: '/history/article/upload'}", title="文章上传")
    nav-menu(@click="toogleNav()", icon="pages", v-link="{path: '/history/article/manage'}", title="文章管理")
    nav-menu(@click="toogleNav()", icon="photo", v-link="{path: '/history/banner/upload'}", title="轮换图上传")
    nav-menu(@click="toogleNav()", icon="burst_mode", v-link="{path: '/history/banner/manage'}", title="轮换图管理")
    nav-divider
    nav-menu(@click="toogleNav()", icon="info_outline", v-link="{path: '/history'}", title="回主界面")
</template>

<script>
import { toast } from 'vx/actions'
import { user, refreshing } from 'vx/getters'

export default {
  data () {
    return {
      navShow: false
    }
  },
  methods: {
    toogleNav () {
      if (this.user.type !== 9) return this.toast('管理员可用')
      this.navShow = !this.navShow
    }
  },
  vuex: {
    actions: {
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
#admin
  .vc-list, .vc-form-list
    margin-top 0
</style>
