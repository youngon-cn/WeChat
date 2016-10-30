import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueCarbon from 'vue-carbon'
import 'vue-carbon/dist/vue-carbon.css'
import store from './vuex/store'
import app from './index'

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueCarbon)

const App = Vue.extend({
  components: { app },
  store
})

const router = new VueRouter({
  history: true,
  saveScrollPosition: true
})

router.map({
  '/forum': {
    component (resolve) {
      require(['./views/forum/'], resolve)
    }
  },
  '/forum/publish': {
    component (resolve) {
      require(['./views/forum/publish.vue'], resolve)
    }
  },
  '/forum/:pid': {
    component (resolve) {
      require(['./views/forum/detail.vue'], resolve)
    }
  },
  '/history': {
    component (resolve) {
      require(['./views/history/'], resolve)
    }
  },
  '/history/article/upload': {
    component (resolve) {
      require(['./views/history/article-upload'], resolve)
    }
  },
  '/history/article/manage': {
    component (resolve) {
      require(['./views/history/article-manage'], resolve)
    }
  },
  '/history/banner/upload': {
    component (resolve) {
      require(['./views/history/banner-upload'], resolve)
    }
  },
  '/history/banner/manage': {
    component (resolve) {
      require(['./views/history/banner-manage'], resolve)
    }
  }
})

router.redirect({
  '*': '/forum'
})

router.start(App, 'body')
