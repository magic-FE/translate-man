import '../common/global'
import Vue from 'vue'
import router from '../router'
import store from '../store'
import App from '../app.vue'
import Content from '../content.vue'
import { POPENV } from '../utils'
import '../utils/union'

let translateApp
const idName = 'translate-man-app'
const app = document.createElement('div')
app.setAttribute('id', idName)

store.dispatch('SYNC_USER_SETTING')

if (POPENV) {
  translateApp = new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount(app)
  document.body.appendChild(translateApp.$el)
} else {
  translateApp = new Vue({
    store,
    render: h => h(Content),
  }).$mount(app)
  // 异步安装
  setTimeout(() => {
    document.body.appendChild(translateApp.$el)
  })
  // 确保安装到 body 上
  setTimeout(() => {
    if (!document.querySelector(`#${idName}`)) {
      document.body.appendChild(translateApp.$el)
    }
  }, 1500)
}
