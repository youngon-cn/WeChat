<template lang="pug">
#history
  slider(:pages="bannerList",:sliderinit="sliderinit")
  tab-bar(:active="tabActive", @tab-change="tabBarClick")
    tab-bar-item get技能
    tab-bar-item 贴心指南
    tab-bar-item 活动中心
  .vc-refresh-control(v-show="refreshing", transition="fade")
    circular(:size="20", :border-width="2")
  list(v-if="tabActive === 0")
    item(link, v-for="article in articleList.a", track-by="_id", transition="fade")
      a.link(:href="article.link")
      item-media
        .thumb(:style="{ backgroundImage: 'url(' + article.img + ')' }")
      item-content
        item-title-row
          item-title {{article.title}}
        item-sub-title {{article.subtitle}}
        item-text {{article.subject}}
  list(v-if="tabActive === 1")
    item(link, v-for="article in articleList.b", track-by="_id", transition="fade")
      a.link(:href="article.link")
      item-media
        .thumb(:style="{ backgroundImage: 'url(' + article.img + ')' }")
      item-content
        item-title-row
          item-title {{article.title}}
        item-sub-title {{article.subtitle}}
        item-text {{article.subject}}
  list(v-if="tabActive === 2")
    item(link, v-for="article in articleList.c", track-by="_id", transition="fade")
      a.link(:href="article.link")
      item-media
        .thumb(:style="{ backgroundImage: 'url(' + article.img + ')' }")
      item-content
        item-title-row
          item-title {{article.title}}
        item-sub-title {{article.subtitle}}
        item-text {{article.subject}}
  float-button(v-if="user.type === 9", style="right: 20px; bottom: 20px; z-index: 99", fixed, color="red", icon="settings", v-link="{path: '/history/article/upload'}")
</template>

<script>
import slider from 'components/history/slider'
import { toogleRefreshing } from 'vx/actions'
import { user, refreshing } from 'vx/getters'

export default {
  attached () {
    this.getBarInfos()
    this.getArtInfos()
  },
  data () {
    return {
      tabActive: 0,
      articleList: {
        a: [],
        b: [],
        c: []
      },
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
    tabBarClick (index) {
      this.tabActive = index
    },
    getArtInfos () {
      this.toogleRefreshing()
      this.$http
        .get('/request/history/article')
        .then((data) => {
          this.toogleRefreshing()
          if (data.body.length) {
            this.articleList.a.length = 0
            this.articleList.b.length = 0
            this.articleList.c.length = 0
            data.body.forEach((article) => {
              if (article.artType === 'a') {
                this.articleList.a.push(article)
              } else if (article.artType === 'b') {
                this.articleList.b.push(article)
              } else if (article.artType === 'c') {
                this.articleList.c.push(article)
              }
            })
          }
        }, (err) => {
          this.toogleRefreshing()
          console.log(err)
        })
    },
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
  },
  vuex: {
    actions: {
      toogleRefreshing
    },
    getters: {
      user,
      refreshing
    }
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

.link
  position absolute
  top 0
  right 0
  bottom 0
  left 0
  z-index 9
.thumb
  width 80px
  height 80px
  max-width none
  background-position center center
  background-size cover
  background-repeat no-repeat
.vc-list
  margin 0

.vc-item-media img
  border-radius 0
</style>
