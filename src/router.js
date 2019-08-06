import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import BaseRouter from './router/base'
import TestRouter from './router/test'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        ...BaseRouter,
        ...TestRouter
      ]
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})

// 全局前置路由守卫
router.beforeEach((to,from,next) => {
  const isLogin = sessionStorage.token ? true : false
  if(to.path === '/') {
    // 清除用户名,令牌
    // sessionStorage.removeItem('userName');
    // sessionStorage.removeItem('token');
    // // 清除后台页面用户存留的tab标签页操作
    // sessionStorage.removeItem('TabName');
    // sessionStorage.removeItem('editableTabs');
    sessionStorage.clear(); //全部清除
    next()
  } else {
    isLogin ? next() : next('/')
  }
})

export default router
