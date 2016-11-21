<template lang="pug">
admin-menu
  span(slot="header") 文章上传
  form-list(slot="content")
    item-form.material(:label="'当前共有文章' + material.total_count + '篇，选中第' + material.item_count + '篇'")
      button(raised, @click="getMaterial(material.item_count-1)") 获取
      range(:value.sync="material.item_count", :step="1", :min="1", :max="material.total_count")
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
  div(slot="plug")
    float-button(style="right: 20px; bottom: 20px; z-index: 99", fixed, color="red", icon="check", @click="upload")
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
    this.getMaterial(0)
  },
  data () {
    return {
      material: {},
      types: [
        {
          label: 'get技能',
          value: 'a'
        }, {
          label: '贴心指南',
          value: 'b'
        }, {
          label: '活动中心',
          value: 'c'
        }
      ],
      artType: 'a',
      infos: {},
      token: ''
    }
  },
  methods: {
    getMaterial (number) {
      this.toogleRefreshing()
      this.$http
        .get('/request/history/material?number=' + number)
        .then((data) => {
          this.toogleRefreshing()
          if (data.body.state === 1) {
            this.material = data.body.material
            this.infos = data.body.infos
          } else {
            this.toast('信息初始化失败')
          }
        }, (err) => {
          this.toogleRefreshing()
          this.toast('信息初始化失败')
          console.log(err)
        })
    },
    upload () {
      if (this.user.type !== 9) return this.toast('管理员可用')
      if (!this.infos.title) {
        this.toast('请输入文章标题')
      } else if (!this.infos.subject) {
        this.toast('请输入文章简介')
      } else {
        this.$http
          .post('/request/history/article', {
            artType: this.artType,
            infos: this.infos
          })
          .then((data) => {
            if (data.body.state === 1) {
              this.toast('文章上传成功')
            } else {
              this.toast('文章上传失败')
            }
          }, (err) => {
            this.toast('文章上传失败')
            console.log(err)
          })
      }
    }
  }
}
</script>

<style lang="stylus">
.material
  .label
    display inline
  .vc-button
    width 28px
    height 21px
    float right

.img-upload-show
  margin 16px

.img-upload-show > img
  width 100%
</style>
