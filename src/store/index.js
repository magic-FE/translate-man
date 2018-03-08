import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = {
  state: {
    // 源语言
    fromLanguage: 'auto',
    // 目标语言
    toLanguage: 'en',
    // 网页翻译语言
    webLanguage: 'en',
    // 所有语言
    languageLists: JSON.parse(browser.i18n.getMessage('languages')),
  },

  mutations: {
    setFromLanguage(state, payload) {
      state.fromLanguage = payload
    },
    setToLanguage(state, payload) {
      state.toLanguage = payload
    },
    setWebLanguage(state, payload) {
      state.webLanguage = payload
    },
  },

  actions: {
    CHOOSE_LANGUAGE({ commit }, { type, value }) {
      console.log(type, value)
      if (type === 'from') {
        commit('setFromLanguage', value)
      } else if (type === 'to') {
        commit('setToLanguage', value)
      } else if (type === 'web') {
        commit('setWebLanguage', value)
      }
    }
  },
}

export default new Vuex.Store(store)

