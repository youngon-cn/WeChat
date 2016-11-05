<template lang="pug">
admin-menu
  span(slot="header") 轮换图管理
  list(slot="content")
    item-cell(v-for="banner in bannerList", track-by="_id", transition="bounce")
      item-title.title {{banner.title}}
      item-title-after
        icon-button.operate(icon="delete", color="red", fill, @click="delart(banner._id)")
  div(slot="plug")
    confirm(:title="confirm.title", show-icon, @sure="handlerSure", :show.sync="confirm.show", :msg="confirm.msg")
</template>

<script>
import { toast } from '../../vuex/actions'
import { user } from '../../vuex/getters'
import adminMenu from '../../components/history/admin-menu'

export default {
  components: {
    adminMenu
  },
  vuex: {
    actions: {
      toast
    },
    getters: {
      user
    }
  },
  attached () {
    this.getBarInfos()
  },
  data () {
    return {
      bannerList: [],
      confirm: {
        msg: '',
        show: false
      }
    }
  },
  methods: {
    getBarInfos () {
      this.$http
        .get('/request/history/banner')
        .then((data) => {
          this.bannerList = data.body
        }, (err) => {
          console.log(err)
        })
    },
    delart (id) {
      if (this.user.type !== 9) return this.toast('管理员可用')
      this.confirm = {
        msg: '确认删除？',
        show: true
      }
      this.handlerSure = () => {
        this.$http
          .delete('/request/history?_id=' + id)
          .then((data) => {
            if (data.body.state === 1) {
              this.toast('删除成功')
              this.getBarInfos()
            } else {
              this.toast('删除失败，请稍后重试')
            }
          }, (err) => {
            console.log(err)
          })
      }
    }
  }
}
</script>

<style lang="stylus">
.title
  font-size 16px
  white-space normal
.operate
  margin-left 10px
</style>
