<template lang="pug">
tab-bar(:active="tabActive")
  tab-bar-item(@tabbar-click="tabBarClick") 技术贴
  tab-bar-item(@tabbar-click="tabBarClick") 天商指南
  tab-bar-item(@tabbar-click="tabBarClick") 实用链接
.vc-refresh-control(v-show="refreshing", transition="fade")
  circular(:size="20", :border-width="2")
list(v-if="tabActive === 0")
  item(link, v-for="article in articleList.a", track-by="_id", transition="fade")
    a.link(:href="article.link")
    item-media
      .thumb(v-bind:style="{ backgroundImage: 'url(' + article.img + ')' }")
    item-content
      item-title-row
        item-title {{article.title}}
      item-sub-title {{article.subtitle}}
      item-text {{article.subject}}
list(v-if="tabActive === 1")
  item(link, v-for="article in articleList.b", track-by="_id", transition="fade")
    a.link(:href="article.link")
    item-media
      .thumb(v-bind:style="{ backgroundImage: 'url(' + article.img + ')' }")
    item-content
      item-title-row
        item-title {{article.title}}
      item-sub-title {{article.subtitle}}
      item-text {{article.subject}}
list(v-if="tabActive === 2")
  item(link, v-for="article in articleList.c", track-by="_id", transition="fade")
    a.link(:href="article.link")
    item-media
      .thumb(v-bind:style="{ backgroundImage: 'url(' + article.img + ')' }")
    item-content
      item-title-row
        item-title {{article.title}}
      item-sub-title {{article.subtitle}}
      item-text {{article.subject}}
</template>

<script>
import { toogleRefreshing } from '../../vuex/actions'
import { refreshing } from '../../vuex/getters'

export default {
  attached () {
    this.getArtInfos()
  },
  data () {
    return {
      tabActive: 0,
      articleList: {
        a: [],
        b: [],
        c: []
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
    }
  },
  vuex: {
    actions: {
      toogleRefreshing
    },
    getters: {
      refreshing
    }
  }
}
</script>

<style lang="stylus" scoped>
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
