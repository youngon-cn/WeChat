<template lang="pug">
admin-menu
  span(slot="header") 文章管理
  list(slot="content")
    item-cell(v-for="article in articleList")
      item-title.title {{article.title}}
      item-title-after
        icon-button.operate(icon="mode_edit", color="green", fill, @click="editart(article._id)")
        icon-button.operate(icon="delete", color="red", fill, @click="delart(article._id)")
    item-cell(v-if="!articleList.length")
      item-title 无已上传文章
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
    this.getArtInfos()
  },
  data () {
    return {
      articleList: [],
      confirm: {
        title: '',
        msg: '',
        show: false
      },
      toasts: []
    }
  },
  methods: {
    getArtInfos () {
      this.$http
        .get('/request/history/article')
        .then((data) => {
          this.articleList = data.body
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
              this.getArtInfos()
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