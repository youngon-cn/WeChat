<template lang="pug">
admin-menu
  span(slot="header") 轮换图上传
  form-list(slot="content")
    text-field(label-float, label="标题", icon="title", :value.sync="infos.title")
    text-field(label-float, label="轮换图链接", icon="language", :value.sync="infos.link")
    text-field(label-float, label="身份验证码", icon="person_pin", :value.sync="token")
    img-upload(item="上传轮换图", :img.sync="infos.img")
  float-button(style="right: 20px; bottom: 20px; z-index: 99", fixed, color="red", icon="check", @click="upload")
  toast(v-for="toast in toasts", :text="toast.text", :loading="toast.loading", :icon="toast.icon", :center="toast.center")
</template>

<script>
import imgUpload from '../../components/history/img-upload'
import adminMenu from '../../components/history/admin-menu'

export default {
  components: {
    imgUpload,
    adminMenu
  },
  data () {
    return {
      infos: {
        link: '',
        title: '',
        img: {
          name: null
        }
      },
      token: '',
      toasts: []
    }
  },
  methods: {
    upload () {
      if (!this.infos.title) {
        this.toast('请输入标题')
      } else if (!this.infos.link) {
        this.toast('请输入轮换图链接')
      } else if (!this.infos.img.name) {
        this.toast('请上传轮换图')
      } else if (!this.token) {
        this.toast('请输入身份验证码')
      } else {
        var MyForm = new FormData()
        MyForm.append('title', this.infos.title)
        MyForm.append('link', this.infos.link)
        MyForm.append('img', this.infos.img)
        MyForm.append('token', this.token)
        this.$http
          .post('/request/history/banner', MyForm)
          .then((data) => {
            if (data.body.state === 1) {
              this.toast('轮换图上传成功')
              this.infos = {
                img: {
                  name: null
                }
              }
            } else {
              this.toast(data.body.err)
            }
          }, (err) => {
            if (err.status === 413) {
              return this.toast('图片过大，上传失败')
            }
            console.log(err)
          })
      }
    },
    toast (text) {
      this.toasts.push({text: text})
      setTimeout(() => this.toasts.splice(0, 1), 2000)
    }
  }
}
</script>

<style lang="stylus">
</style>