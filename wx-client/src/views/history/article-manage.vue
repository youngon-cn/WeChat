<template lang="pug">
admin-menu
  span(slot="header") 文章管理
  list(slot="content")
    item-cell(v-for="article in articleList", track-by="_id", transition="bounce")
      item-title.title {{article.title}}
      item-title-after
        icon-button.operate(icon="mode_edit", color="green", fill, @click="editart(article._id)")
        icon-button.operate(icon="delete", color="red", fill, @click="delart(article._id)")
  div(slot="plug")
    confirm(:title="confirm.title", show-icon, @sure="handlerSure", :show.sync="confirm.show", :msg="confirm.msg")
</template>

<script>
import { toast, toogleRefreshing } from 'vx/actions'
import { user } from 'vx/getters'
import adminMenu from 'components/history/admin-menu'

export default {
  components: {
    adminMenu
  },
  vuex: {
    actions: {
      toast,
      toogleRefreshing
    },
    getters: {
      user
    }
  },
  attached () {
    this.getArtInfos()
  },
  data () {
    return {
      articleList: [],
      confirm: {
        title: '',
        msg: '',
        show: false
      }
    }
  },
  methods: {
    getArtInfos () {
      this.toogleRefreshing()
      this.$http
        .get('/request/history/article')
        .then((data) => {
          this.toogleRefreshing()
          this.articleList = data.body
        }, (err) => {
          this.toogleRefreshing()
          console.log(err)
        })
    },
    delart (id) {
      if (this.user.type !== 9) return this.toast('管理员可用')
      this.confirm.msg = '确认删除？'
      this.confirm.show = true
      this.handlerSure = () => {
        this.$http
          .delete('/request/history?_id=' + id)
          .then((data) => {
            if (data.body.state === 1) {
              this.toast('删除成功')
              this.getArtInfos()
            } else {
              this.toast('删除失败，请稍后重试')
            }
          }, (err) => {
            console.log(err)
          })
      }
    },
    editart (id) {
      if (this.user.type !== 9) return this.toast('管理员可用')
      this.toast('开发中')
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
