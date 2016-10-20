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
</template>

<script>
import { toast } from '../../vuex/actions'
import adminMenu from '../../components/history/admin-menu'

export default {
  components: {
    adminMenu
  },
  vuex: {
    actions: {
      toast
    }
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