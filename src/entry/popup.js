import '../common/global'
import Vue from 'vue'
import router from '../router'
import store from '../store'
import App from '../app.vue'

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
