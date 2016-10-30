<template lang="pug">
tab-bar(:active="tabActive")
  tab-bar-item(@tabbar-click="tabBarClick") 技术贴
  tab-bar-item(@tabbar-click="tabBarClick") 天商指南
  tab-bar-item(@tabbar-click="tabBarClick") 实用链接
list(v-if="tabActive === 0")
  item(link, v-for="article in articleList.a")
    a.link(:href="article.link")
    item-media
      img.thumb(:src="article.img")
    item-content
      item-title-row
        item-title {{article.title}}
        item-title-after youngon
      item-sub-title {{article.subtitle}}
      item-text {{article.subject}}
list(v-if="tabActive === 1")
  item(link, v-for="article in articleList.b")
    a.link(:href="article.link")
    item-media
      img.thumb(:src="article.img")
    item-content
      item-title-row
        item-title {{article.title}}
        item-title-after youngon
      item-sub-title {{article.subtitle}}
      item-text {{article.subject}}
list(v-if="tabActive === 2")
  item(link, v-for="article in articleList.c")
    a.link(:href="article.link")
    item-media
      img.thumb(:src="article.img")
    item-content
      item-title-row
        item-title {{article.title}}
        item-title-after youngon
      item-sub-title {{article.subtitle}}
      item-text {{article.subject}}
</template>

<script>
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
      this.$http
        .get('/request/history/article')
        .then((data) => {
          if (data.body.length) {
            this.articleList.length = 0
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
          console.log(err)
        })
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
  max-width none
.vc-list
  margin 0

.vc-item-media img
  border-radius 0
</style>
