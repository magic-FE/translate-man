<template>
  <div class="input-box">
    <div class="languages">
      <div class="from" @click="openLanguage('from')">
        <LanguageText :value="fromLanguage"></LanguageText>&nbsp;
        <template v-if="fromLanguage === 'auto' && autoFromLanguage">
          (<LanguageText :value="autoFromLanguage"></LanguageText>)
        </template>
      </div>
      <Icon class="arrow-right" name="arrowRightWhite"></Icon>
      <div class="to" @click="openLanguage('to')">
        <LanguageText :value="toLanguage"></LanguageText>
      </div>
    </div>
    <div class="textarea-wrap">
      <textarea v-if="showTextarea"
        placeholder="输入单词或句子"
        autofocus
        :value="keyword"
        ref="textareaInput">
      </textarea>
      <complete-list class="complete-list-wrap"></complete-list>
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
        this.$router.push({ name: 'language', query: { type } })
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

<style scoped>
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
    font-size: 12px;
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
        color: #277977;
      }

      &::-moz-placeholder {
        color: #277977;
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


