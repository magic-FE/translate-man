import '../common/global'
import Vue from 'vue'
import router from '../router'
import store from '../store'
import App from '../app.vue'
import Content from '../content.vue'
import { POPENV } from '../utils'

const idName = 'translate-man-app'
const app = document.createElement('div')
app.setAttribute('id', idName)

store.dispatch('SYNC_USER_SETTING')

if (POPENV) {
  document.body.appendChild(app)
  new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount(`#${idName}`)
} else {
  // 异步安装
  setTimeout(() => {
    document.body.appendChild(app)
    new Vue({
      store,
      render: h => h(Content),
    }).$mount(`#${idName}`)
  }, 0)
}
