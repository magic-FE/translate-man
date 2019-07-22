import Vue from 'vue'
import Vuex from 'vuex'
import { fixArrayError, saveAndSendMessage, getUILanguage, xss } from '../utils'
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
    toLanguage: getUILanguage(),
    // 所有语言
    languageLists: JSON.parse(browser.i18n.getMessage('languages')),
    // 访问域名
    googleHost: googleChina,
    // 谷歌 TKK
    googleTKK: '',
    // 单词自动匹配
    completeList: [],
    // 翻译结果
    translateResult: {
      keyword: '',
      phonetic: '',
      translateList: [],
      definition: [],
      synonym: [],
      example: '',
    },
    // 是否展示更多
    isShowMore: false,
    // 失败尝试次数
    tryCount: 1,
    // 播放速度
    speed: 1,
    userSetting: {
      webLanguage: getUILanguage(),
      doubleClick: true,
      stroke: true,
      pressKey: true,
      pressKeyString: 'Control',
      hover: false,
      hoverTime: 1,
      autoSound: false,
      audioSource: null,
      bgColor: '#ffffff',
    },
  },

  mutations: {
    reset(state) {
      state.keyword = ''
      state.tryCount = 1
      state.translateResult = {
        keyword: '',
        phonetic: '',
        translateList: [],
        definition: [],
        synonym: [],
        example: '',
      }
      state.isShowMore = false
      state.completeList = []
    },
    setKeyword(state, payload) {
      state.speed = 1
      state.isShowMore = false
      const newKeyword = payload || ''
      state.keyword = newKeyword.trim()
    },
    setGoogleTKK(state, payload) {
      state.googleTKK = payload
      // cache 1 day for google TKK
      browser.storage.local.set({ googleTKK: {
        value: payload,
        expire: Date.now() + 86400000,
      } })
    },
    setIsShowMore(state, payload) {
      state.isShowMore = payload
    },
    setFromLanguage(state, payload) {
      state.fromLanguage = payload
      browser.storage.local.set({ fromLanguage: payload })
    },
    setToLanguage(state, payload) {
      state.toLanguage = payload
      browser.storage.local.set({ toLanguage: payload })
    },
    setWebLanguage(state, payload) {
      state.userSetting.webLanguage = payload
      saveAndSendMessage({ userSetting: state.userSetting })
    },
    setDoubleClick(state, payload) {
      state.userSetting.doubleClick = payload
      saveAndSendMessage({ userSetting: state.userSetting })
    },
    setStroke(state, payload) {
      state.userSetting.stroke = payload
      saveAndSendMessage({ userSetting: state.userSetting })
    },
    setHover(state, payload) {
      state.userSetting.hover = payload
      saveAndSendMessage({ userSetting: state.userSetting })
    },
    setHoverTime(state, payload) {
      state.userSetting.hoverTime = payload
      saveAndSendMessage({ userSetting: state.userSetting })
    },
    setPressKey(state, payload) {
      state.userSetting.pressKey = payload
      saveAndSendMessage({ userSetting: state.userSetting })
    },
    setPressKeyString(state, payload) {
      state.userSetting.pressKeyString = payload
      saveAndSendMessage({ userSetting: state.userSetting })
    },
    setAutoSound(state, payload) {
      state.userSetting.autoSound = payload
      saveAndSendMessage({ userSetting: state.userSetting })
    },
    setBgColor(state, payload) {
      state.userSetting.bgColor = payload
      saveAndSendMessage({ userSetting: state.userSetting })
    },
    stopSound(state) {
      if (state.audioSource) {
        state.audioSource.stop()
      }
    },
  },

  actions: {
    SYNC_USER_SETTING({ state }) {
      browser.storage.local.get('googleTKK', ({ googleTKK }) => {
        if (googleTKK && googleTKK.value && googleTKK.expire > Date.now()) {
          state.googleTKK = googleTKK.value
          window.TKK = googleTKK.value
        }
      })
      browser.storage.local.get('fromLanguage', ({ fromLanguage }) => {
        if (fromLanguage) {
          state.fromLanguage = fromLanguage
        }
      })
      browser.storage.local.get('toLanguage', ({ toLanguage }) => {
        if (toLanguage) {
          state.toLanguage = toLanguage
        }
      })
      browser.storage.local.get('userSetting', ({ userSetting }) => {
        if (userSetting) {
          state.userSetting = Object.assign(state.userSetting, userSetting)
        }
      })
    },
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

    WEB_TRANSLATE_KEYWORD({ state, commit, dispatch }, keyWord) {
      commit('setKeyword', keyWord)
      state.tryCount = 1
      return dispatch('TRANSLATE_KEYWORD', {
        fromLanguage: 'auto',
        toLanguage: state.userSetting.webLanguage,
      })
    },

    TRANSLATE_KEYWORD({ state, commit, dispatch }, { fromLanguage, toLanguage, stop } = {}) {
      if (!state.keyword) {
        commit('reset')
        return Promise.reject()
      }
      return new Promise((resolve, reject) => {
        if (state.tryCount < 0) {
          return reject()
        }
        state.tryCount--
        dispatch('GET_GOOGLE_TK', state.keyword).then(tk => {
          fetchGoogleTranslate({
            tk,
            host: state.googleHost,
            fromLanguage: fromLanguage || state.fromLanguage,
            toLanguage: toLanguage || state.toLanguage,
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
                definition: [],
                synonym: [],
                example: '',
              }
              let keyword = ''
              let simple = ''
              if (response[2]) {
                // 如果检测语言和目标一致 智能转换
                if (!fromLanguage && response[2] === state.toLanguage) {
                  if (response[2] !== state.userSetting.webLanguage) {
                    commit('setToLanguage', state.userSetting.webLanguage)
                    return dispatch('TRANSLATE_KEYWORD').then(resolve, reject)
                  } else if (state.autoFromLanguage && response[2] !== state.autoFromLanguage) {
                    commit('setToLanguage', state.autoFromLanguage)
                    return dispatch('TRANSLATE_KEYWORD').then(resolve, reject)
                  } else if (response[2] !== 'en') {
                    commit('setToLanguage', 'en')
                    return dispatch('TRANSLATE_KEYWORD').then(resolve, reject)
                  }
                } else if (!stop && fromLanguage && response[2] !== 'en' && response[2] === state.userSetting.webLanguage) {
                  return dispatch('TRANSLATE_KEYWORD', {
                    fromLanguage: 'auto',
                    toLanguage: 'en',
                    stop: true,
                  }).then(resolve, reject)
                }
                state.autoFromLanguage = response[2]
              }
              if (state.userSetting.autoSound) {
                dispatch('GOOGLE_SOUND')
              }
              if (response[0]) {
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
                  simple = xss(simple)
                  simple = simple.replace(/\n/g, '<br />')
                  result.translateList = [['', [simple]]]
                }
                // 定义
                if (response[12]) {
                  result.definition = response[12]
                }
                // 同义词
                if (response[11]) {
                  result.synonym = response[11]
                }
                // 示例
                if (response[13]) {
                  result.example = response[13][0] && response[13][0][0] && response[13][0][0][0]
                }
                result.keyword = keyword
                state.translateResult = result
              }
              resolve()
            })
            .catch(() => {
              commit('setGoogleTKK', '')
              dispatch('TRANSLATE_KEYWORD').catch(() => {})
            })
        }).catch(() => {})
      })
    },

    GOOGLE_SOUND({ state, commit, dispatch }) {
      commit('stopSound')
      dispatch('GET_GOOGLE_TK', state.keyword).then(tk => {
        fetchGoogleSound({
          tk,
          host: state.googleHost,
          toLanguage: state.autoFromLanguage || 'en',
          keyword: state.keyword,
          speed: state.speed,
        }).then(arraybuffer => {
          const ac = new (window.AudioContext || window.webkitAudioContext)()
          ac.decodeAudioData(arraybuffer).then(buffer => {
            state.audioSource = ac.createBufferSource()
            state.audioSource.buffer = buffer
            state.audioSource.connect(ac.destination)
            state.audioSource.start(0)
          })
        })
        state.speed = state.speed === 1 ? 0.24 : 1
      }).catch(() => {})
    },

    GET_GOOGLE_TK({ state, commit, dispatch }, keyword) {
      if (state.googleTKK) {
        return Promise.resolve(googleTK(keyword))
      }
      return dispatch('GET_GOOGLE_HTML').then(({ html, host }) => {
        state.googleHost = host
        if (!html) {
          return
        }
        // 兼容 TKK 算法（新版 translate 网站直接返回了可用的 TKK）
        const code = html.match(/TKK=(.*?)\(\)\)'\);/g)
        const TKKMatch = html.match(/tkk:'([\d.]+)'/)
        const TKK = TKKMatch && TKKMatch[1]
        if (code || TKK) {
          /* eslint-disable */
          if (code) {
            eval('window.' + code[0])
          } else if (TKK) {
            window.TKK = TKK
          }
          /* eslint-enable */
          if (typeof window.TKK !== 'undefined') {
            commit('setGoogleTKK', window.TKK)
            const tk = googleTK(keyword)
            return tk
          }
        }
      })
    },
  },
}

export default new Vuex.Store(store)
