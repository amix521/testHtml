import Vue from 'vue'
import Router from 'vue-router'
import TestStomp from '@/components/test/TestStomp'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'TestStomp',
      component: TestStomp
    }
  ]
})
