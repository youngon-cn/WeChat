<template lang="pug">
admin-menu
  span(slot="header") 文章上传
  form-list(slot="content")
    .vc-item-form
      .vc-item-form-icon
        icon(value="assignment")
      .vc-item-form-content
        label.vc-text-field
          .label 文章类型
          radio.type(v-for="type in types", name="artType", :model.sync="artType", :value="type.value", :label="type.label")
    text-field(label-float, label="文章标题", icon="title", :value.sync="infos.title")
    text-field(label-float, label="子标题", icon="subtitles", :value.sync="infos.subtitle")
    text-field(label-float, label="简介", icon="subject", type="textarea", :rows="3", :value.sync="infos.subject")
    text-field(label-float, label="文章链接", icon="language", :value.sync="infos.link")
    img-upload(item="上传缩略图", :img.sync="infos.img")
  div(slot="plug")
    float-button(style="right: 20px; bottom: 20px; z-index: 99", fixed, color="red", icon="check", @click="upload")
</template>

<script>
import { toast } from '../../vuex/actions'
import { user } from '../../vuex/getters'
import imgUpload from '../../components/history/img-upload'
import adminMenu from '../../components/history/admin-menu'

export default {
  components: {
    imgUpload,
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
  data () {
    return {
      types: [
        {
          label: '技术贴',
          value: 'a'
        }, {
          label: '天商指南',
          value: 'b'
        }, {
          label: '使用链接',
          value: 'c'
        }
      ],
      artType: 'a',
      infos: {
        title: '',
        subtitle: '',
        subject: '',
        link: '',
        img: {
          name: null
        }
      },
      token: ''
    }
  },
  methods: {
    upload () {
      if (this.user.type !== 9) return this.toast('管理员可用')
      if (!this.infos.title) {
        this.toast('请输入文章标题')
      } else if (!this.infos.subtitle) {
        this.toast('请输入子标题')
      } else if (!this.infos.subject) {
        this.toast('请输入文章简介')
      } else if (!this.infos.link) {
        this.toast('请输入文章链接')
      } else if (!this.infos.img.name) {
        this.toast('请上传缩略图')
      } else {
        var MyForm = new FormData()
        MyForm.append('artType', this.artType)
        MyForm.append('title', this.infos.title)
        MyForm.append('subtitle', this.infos.subtitle)
        MyForm.append('subject', this.infos.subject)
        MyForm.append('link', this.infos.link)
        MyForm.append('img', this.infos.img)
        MyForm.append('token', this.token)
        this.$http
          .post('/request/history/article', MyForm)
          .then((data) => {
            if (data.body.state === 1) {
              this.toast('文章上传成功')
              this.infos = {
                img: {
                  name: null
                }
              }
            } else {
              this.toast('文章上传失败')
            }
          }, (err) => {
            if (err.status === 413) {
              return this.toast('图片过大，上传失败')
            }
            console.log(err)
          })
      }
    }
  }
}
</script>

<style lang="stylus">
</style>
