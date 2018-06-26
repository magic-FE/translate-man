import Vue from 'vue'
import VueRouter from 'vue-router'
import { Popup, Language, Login, Setting, WordBook, About } from '../containers'
import { POPENV } from '../utils'

let router = null

if (POPENV) {
  Vue.use(VueRouter)

  router = new VueRouter({
    routes: [
      // 主页
      {
        name: 'popup',
        path: '/',
        component: Popup,
        meta: { keepAlive: true }
      },
      // 设置
      {
        name: 'setting',
        path: '/setting',
        component: Setting,
      },
      // 语言
      {
        name: 'language',
        path: '/language',
        component: Language,
      },
      // 登录
      {
        name: 'login',
        path: '/login',
        component: Login,
      },
      // 单词本
      {
        name: 'wordbook',
        path: '/wordbook',
        component: WordBook,
      },
      // 关于
      {
        name: 'about',
        path: '/about',
        component: About,
      },
    ],
  })
}

export default router
