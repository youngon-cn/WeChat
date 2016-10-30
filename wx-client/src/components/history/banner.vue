<template lang="pug">
slider(:pages="bannerList",:sliderinit="sliderinit")
</template>

<script>
import slider from './slider'

export default {
  attached () {
    this.getBarInfos()
  },
  data () {
    return {
      bannerList: [{
        link: '',
        style: ''
      }],
      sliderinit: {
        currentPage: 0,
        start: {},
        end: {},
        tracking: false,
        thresholdTime: 500, // 滑动判定距离
        thresholdDistance: 100, // 滑动判定时间
        loop: true, // 无限循环
        autoplay: 5000 // 自动播放:时间[ms]
      }
    }
  },
  methods: {
    getBarInfos () {
      this.$http
        .get('/request/history/banner')
        .then((data) => {
          if (data.body.length) {
            this.bannerList.length = 0
            data.body.forEach((banner) => {
              this.bannerList.push({
                link: banner.link,
                style: {
                  'background': 'url(' + banner.img + ')'
                }
              })
            })
          }
        }, (err) => {
          console.log(err)
        })
    }
  },
  components: {
    slider
  }
}
</script>

<style lang="stylus" scoped>
.slider-container
  margin 0
  width 100%

.sliderButton
  text-align center

.sliderButton button
  display inline-block
  background #fff
  border-radius 3px
  height 30px
  border 1px solid #333
  line-height 30px
</style>
