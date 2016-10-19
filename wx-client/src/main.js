import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueCarbon from 'vue-carbon'
import 'vue-carbon/dist/vue-carbon.css' // 加载css文件
import app from './index'

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueCarbon)

const router = new VueRouter({
  history: true
})

router.map({
  '/history': {
    component (resolve) {
      require(['./views/history/'], resolve)
    }
  },
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
  '/forum/detail/:aid': {
    component (resolve) {
      require(['./views/forum/detail.vue'], resolve)
    }
  },
  '/ygadmin/history/article/upload': {
    component (resolve) {
      require(['./views/history/article-upload'], resolve)
    }
  },
  '/ygadmin/history/article/manage': {
    component (resolve) {
      require(['./views/history/article-manage'], resolve)
    }
  },
  '/ygadmin/history/banner/upload': {
    component (resolve) {
      require(['./views/history/banner-upload'], resolve)
    }
  },
  '/ygadmin/history/banner/manage': {
    component (resolve) {
      require(['./views/history/banner-manage'], resolve)
    }
  }
})

router.redirect({
  '/ygadmin': '/ygadmin/history/article/upload'
})

router.redirect({
  '*': '/history'
})

const App = Vue.extend({
  components: { app }
})

router.start(App, 'body')
