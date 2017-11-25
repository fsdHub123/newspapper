import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/views/home'
import Article from '@/components/views/article'
import Comments from '@/components/views/comments'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { keepAlive: true }
    },
    {
      path: '/article',
      name: 'Article',
      component: Article
    },
    {
      path: '/Comments',
      name: 'Comments',
      component: Comments
    }
  ]
})
