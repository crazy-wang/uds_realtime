import Vue from 'vue'
import Router from 'vue-router'
import RealTime from '@/views/realTime/realTime'
import User from '@/views/user'
import WordMap from '@/views/wordMap/wordMap'
import Demo from '@/views/demo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: RealTime,
      redirect: '/device_user'
    },
    {
      path: '/device_user',
      name: 'RealTime',
      component: RealTime,
    },
    {
      path: '/registered_user',
      component: User,
    }
    // {
    //   path: '/user',
    //   component: User,
    //   alias: '/b' 别名
    // }
    // {
    //   path: '/wordMap',
    //   component: WordMap
    // },
    // {
    //   path: '/demo',
    //   component: Demo
    // }
  ]
})
