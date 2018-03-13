<template>
  <div :class="$style['input-box']">
    <div :class="$style.languages">
      <div :class="$style.from" @click="openLanguage('from')">
        <LanguageText :value="fromLanguage"></LanguageText>&nbsp;
        <template v-if="fromLanguage === 'auto' && autoFromLanguage">
          (<LanguageText :value="autoFromLanguage"></LanguageText>)
        </template>
      </div>
      <Icon :class="$style['arrow-right']" name="arrowRightWhite"></Icon>
      <div :class="$style.to" @click="openLanguage('to')">
        <LanguageText :value="toLanguage"></LanguageText>
      </div>
    </div>
    <div :class="$style['textarea-wrap']">
      <textarea v-if="showTextarea"
        :placeholder="placeholder"
        autofocus
        :value="keyword"
        ref="textareaInput">
      </textarea>
      <complete-list :class="$style['complete-list-wrap']"></complete-list>
    </div>
  </div>
</template>

<script>
  import Vuex from 'vuex'
  import { Icon, LanguageText, CompleteList } from '@/components'

  export default {
    components: {
      Icon,
      LanguageText,
      CompleteList,
    },

    data() {
      return {
        showTextarea: false,
        placeholder: browser.i18n.getMessage('search_placeholder'),
      }
    },

    computed: {
      ...Vuex.mapState([
        'keyword',
        'fromLanguage',
        'autoFromLanguage',
        'toLanguage',
      ]),
    },

    mounted() {
      // 直接写 textarea 打开会让页面展示不全， 不知道为什么
      setTimeout(() => {
        this.showTextarea = true
        this.$nextTick(() => {
          this.inputChangeEvent(this.$refs.textareaInput)
        })
      }, 100)
    },

    methods: {
      openLanguage(type) {
        this.$router.push({
          name: 'language',
          query: {
            type,
            value: type === 'from' ? this.fromLanguage : this.toLanguage,
            hideAuto: type !== 'from',
          }
        })
      },
      inputChangeEvent(el) {
        let inputLock = false
        el.addEventListener('compositionstart', () => {
          inputLock = true
        })
        el.addEventListener('compositionend', () => {
          inputLock = false
          this.$store.commit('setKeyword', el.value)
        })
        el.addEventListener('input', () => {
          if (!inputLock) {
            this.$store.commit('setKeyword', el.value)
            event.returnValue = false
          }
        })
      },
    },
  }
</script>

<style module>
  .input-box {
    border-radius: 4px;
	  background-color: rgba(255, 255, 255, 0.19);
  }

  .languages {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 0 10px;
    padding: 5px 0;
    color: #ffffff;
    font-size: 14px;
    border-bottom: 1px solid rgba(39, 181, 178, 0.46);
    transition: color 0.2s;

    .from {
      display: flex;
    }

    .from,
    .to {
      cursor: pointer;

      &:hover {
        color: #BCFFFE;
      }
    }
  }

  .arrow-right {
    width: 12px;
    margin: 0 10px;
  }

  .textarea-wrap {
    position: relative;
    height: 70px;

    textarea {
      display: block;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      font-size: 14px;
      color: #ffffff;
      border: 0;
      outline: 0;
      resize: none;
      padding: 5px 10px;
      background-color: transparent;

      &::-webkit-input-placeholder {
        color: #1b8c89;
      }

      &::-moz-placeholder {
        color: #1b8c89;
      }
    }
  }

  .complete-list-wrap {
    position: relative;
    left: 0;
    top: -45px;
    z-index: 1;
    width: 100%;
  }
</style>


