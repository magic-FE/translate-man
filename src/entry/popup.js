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
document.body.appendChild(app)

new Vue({
  router,
  store,
  render: h => h(POPENV ? App : Content),
}).$mount(`#${idName}`)
