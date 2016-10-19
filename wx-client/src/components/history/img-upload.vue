<template lang="pug">
.img-upload
  .img-upload-input
    button.img-upload-button(fill, raised)
      icon(value="photo")
      span {{item}}
    input(type="file", accept="image/*", @change="getImg")
  .img-upload-show(v-if="img.name", transition="fade")
    p 已选择文件：{{img.name}}
      icon.pull-right(value="close", @click="initImg")
    img(:src="imgbase64")
</template>

<script>
export default {
  props: {
    item: {
      type: String,
      default: '上传图片'
    },
    img: {
      name: {
        type: String,
        default: ''
      }
    },
    imgbase64: {
      type: String,
      default: ''
    }
  },
  methods: {
    getImg (e) {
      var file = e.target.files[0]
      this.img = file || this.img
      var reader = new FileReader()
      reader.readAsDataURL(this.img)
      reader.onload = (e) => {
        this.imgbase64 = e.target.result
      }
    },
    initImg () {
      this.img = {
        name: null
      }
      this.imgbase64 = null
    }
  }
}
</script>

<style lang="stylus">
.img-upload
  position: relative;
  padding: 0 16px;
  min-height: 48px;
  color: #7e848c;
  font-size: 14px;

.img-upload-input
  width 100%
  height 46px
  margin-top 16px

.img-upload-button
  height 100%

.img-upload-input > input
  opacity 0
  position absolute
  top 0
  right 0
  bottom 0
  left 0
  width 100%
  padding 0 16px

.img-upload-show
  margin 16px

.img-upload-show > img
  width 100%

.pull-right
  float right

.fade-transition
  transition all .2s linear
  opacity 1

.fade-enter, .fade-leave
  opacity 0
</style>