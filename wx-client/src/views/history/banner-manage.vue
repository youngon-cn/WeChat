<template lang="pug">
admin-menu
  span(slot="header") 轮换图管理
  list(slot="content")
    item-cell(v-for="banner in bannerList")
      item-title.title {{banner.title}}
      item-title-after
        icon-button.operate(icon="mode_edit", color="green", fill, @click="editart(banner._id)")
        icon-button.operate(icon="delete", color="red", fill, @click="delart(banner._id)")
    item-cell(v-if="!bannerList.length")
      item-title 无已上传轮换图
  confirm(:title="confirm.title", show-icon, @sure="handlerSure", :show.sync="confirm.show", :msg="confirm.msg")
  toast(v-for="toast in toasts", :text="toast.text", :loading="toast.loading", :icon="toast.icon", :center="toast.center")
</template>

<script>
import adminMenu from '../../components/history/admin-menu'

export default {
  components: {
    adminMenu
  },
  ready () {
    this.getBarInfos()
  },
  data () {
    return {
      bannerList: [],
      confirm: {
        title: '',
        msg: '',
        show: false
      },
      toasts: []
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
      this.confirm.msg = '确认删除？'
      this.confirm.show = true
      this.handlerSure = () => {
        this.$http
          .delete('/request/history?_id=' + id)
          .then((data) => {
            if (data.body.state === 1) {
              this.toast('删除成功')
              this.getBarInfos()
            }
          }, (err) => {
            console.log(err)
          })
      }
    },
    editart (id) {
      this.toast('开发中')
    },
    toast (text) {
      this.toasts.push({text: text})
      setTimeout(() => this.toasts.splice(0, 1), 2000)
    }
  }
}
</script>

<style lang="stylus">
.title
  font-size 22px
.operate
  margin-left 10px
</style>