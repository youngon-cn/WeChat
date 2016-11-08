import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueTouch from 'vue-touch'
import VueCarbon from 'vue-carbon'
import 'vue-carbon/dist/vue-carbon.css'
import store from './vuex/store'
import app from './index'

VueTouch.config.swipe = {
  direction: 'horizontal'
}

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueTouch)
Vue.use(VueCarbon)

const App = Vue.extend({
  components: { app },
  store
})

const router = new VueRouter({
  history: true
})

router.map({
  '/forum': {
    component (resolve) {
      require(['./views/forum/'], resolve)
    }
  },
  '/person/:pid': {
    component (resolve) {
      require(['./views/forum/person.vue'], resolve)
    }
  },
  '/person': {
    component (resolve) {
      require(['./views/forum/person.vue'], resolve)
    }
  },
  '/forum/publish': {
    component (resolve) {
      require(['./views/forum/publish.vue'], resolve)
    }
  },
  '/forum/detail/:pid': {
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
