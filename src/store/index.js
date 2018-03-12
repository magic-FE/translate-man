import Vue from 'vue'
import Vuex from 'vuex'
import { fixArrayError } from '../utils'
import { googleChina, googleNet } from '../services/hosts'
import { fetchGoogleChina, fetchGoogleNet, fetchGoogleSearch, fetchGoogleTranslate, fetchGoogleSound } from '../services/api'
import googleTK from '../services/googleTK'

Vue.use(Vuex)

const store = {
  state: {
    // 翻译的单词
    keyword: '',
    // 源语言
    fromLanguage: 'auto',
    // 自动检测源语言语种
    autoFromLanguage: '',
    // 目标语言
    toLanguage: 'zh-CN',
    // 所有语言
    languageLists: JSON.parse(browser.i18n.getMessage('languages')),
    // 访问域名
    googleHost: googleChina,
    // 谷歌 TKK
    googleTKK: '',
    // 单词自动匹配
    completeList: [],
    // 翻译结果
    translateResult: {},
    // 失败尝试次数
    tryCount: 1,
    // 播放速度
    speed: 1,
    userSetting: {
      webLanguage: 'zh-CN',
      doubleClick: true,
      stroke: true,
      hover: true,
      pressKey: true,
      presskeyCode: 17,
      autoSound: false,
    },
    // 音频对象
    ac: new (window.AudioContext || window.webkitAudioContext)()
  },

  mutations: {
    reset(state) {
      state.keyword = ''
      state.tryCount = 1
      state.translateResult = {}
      state.completeList = []
    },
    setKeyword(state, payload) {
      state.speed = 1
      if (payload) {
        state.keyword = payload.trim()
      }
    },
    setFromLanguage(state, payload) {
      state.fromLanguage = payload
    },
    setToLanguage(state, payload) {
      state.toLanguage = payload
    },
    setWebLanguage(state, payload) {
      state.userSetting.webLanguage = payload
    },
    setDoubleClick(state, payload) {
      state.userSetting.doubleClick = payload
    },
    setStroke(state, payload) {
      state.userSetting.stroke = payload
    },
    setHover(state, payload) {
      state.userSetting.hover = payload
    },
    setPressKey(state, payload) {
      state.userSetting.pressKey = payload
    },
    setAutoSound(state, payload) {
      state.userSetting.autoSound = payload
    },
  },

  actions: {
    CHOOSE_LANGUAGE({ commit }, { type, value }) {
      if (type === 'from') {
        commit('setFromLanguage', value)
      } else if (type === 'to') {
        commit('setToLanguage', value)
      } else if (type === 'web') {
        commit('setWebLanguage', value)
      }
    },

    GET_GOOGLE_HTML() {
      return Promise.race([
        fetchGoogleChina().then(html => ({ html, host: googleChina })),
        fetchGoogleNet().then(html => ({ html, host: googleNet })),
      ])
    },

    AUTO_COMPLETE({ state }) {
      if (!state.keyword || !~['auto', 'en'].indexOf(state.fromLanguage)) {
        return
      }

      fetchGoogleSearch({
        webLanguage: state.userSetting.webLanguage,
        keyword: state.keyword,
      })
        .then(response => {
          try {
            const lists = JSON.parse(response.slice(19, -1))[1]
            state.completeList = lists.map(v => v[0])
          } catch (e) {
            state.completeList = []
          }
        })
        .catch(() => {
          state.completeList = []
        })
    },

    WEB_TRANSLATE_KEYWORD({ commit, dispatch }, keyWord) {
      commit('setKeyword', keyWord)
      return dispatch('TRANSLATE_KEYWORD')
    },

    TRANSLATE_KEYWORD({ state, dispatch }) {
      return new Promise((resolve, reject) => {
        if (state.tryCount < 0) {
          return reject()
        }
        state.tryCount--
        dispatch('GET_GOOGLE_TK', state.keyword).then(tk => {
          fetchGoogleTranslate({
            tk,
            host: state.googleHost,
            fromLanguage: state.fromLanguage,
            toLanguage: state.toLanguage,
            webLanguage: state.userSetting.webLanguage,
            keyword: state.keyword,
          })
            .then(fixArrayError)
            .then(response => {
              state.tryCount = 1
              const result = {
                keyword: '',
                phonetic: '',
                translateList: [],
              }
              let keyword = ''
              let simple = ''
              if (state.userSetting.isAutoSound) {
                dispatch('GOOGLE_SOUND')
              }
              if (response[0]) {
                if (response[2]) {
                  state.autoFromLanguage = response[2]
                }
                for (let i = 0, len = response[0].length; i < len; i++) {
                  if (i === len - 1 && i > 0) {
                    if (response[0][i] && response[0][i][3]) {
                      result.phonetic = response[0][i][3]
                    }
                  } else {
                    // 如果没有单词翻译 采用简单翻译
                    if (response[1]) {
                      result.translateList = response[1]
                    } else if (response[0][i] && response[0][i][0]) {
                      simple += response[0][i][0]
                    }
                    if (response[0][i] && response[0][i][1]) {
                      keyword += response[0][i][1]
                    }
                  }
                }
                if (simple) {
                  result.translateList = [['', [simple]]]
                }
                result.keyword = keyword
                state.translateResult = result
              }
              resolve()
            })
            .catch(() => {
              state.googleTKK = ''
              dispatch('TRANSLATE_KEYWORD')
            })
        })
      })
    },

    GOOGLE_SOUND({ state, dispatch }) {
      dispatch('GET_GOOGLE_TK', state.keyword).then(tk => {
        fetchGoogleSound({
          tk,
          host: state.googleHost,
          toLanguage: state.autoFromLanguage || 'en',
          keyword: state.keyword,
          speed: state.speed,
        }).then(arraybuffer => {
          state.ac.decodeAudioData(arraybuffer).then(buffer => {
            const source = state.ac.createBufferSource()
            source.buffer = buffer
            source.connect(state.ac.destination)
            source.start(0)
          })
        })
        state.speed = state.speed === 1 ? 0.24 : 1
      })
    },

    GET_GOOGLE_TK({ state, dispatch }, keyword) {
      if (state.googleTKK) {
        return Promise.resolve(googleTK(keyword))
      }
      return dispatch('GET_GOOGLE_HTML').then(({ html, host }) => {
        state.googleHost = host
        const code = html.match(/TKK=(.*?)\(\)\)'\);/g)
        if (code) {
          /* eslint-disable */
          eval('window.' + code[0])
          /* eslint-enable */
          if (typeof window.TKK !== 'undefined') {
            state.googleTKK = window.TKK
            const tk = googleTK(keyword)
            return tk
          }
        }
      })
    },
  },
}

export default new Vuex.Store(store)
