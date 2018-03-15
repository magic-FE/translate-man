<template>
  <div>
    <NavBar :name="pageName"></NavBar>
    <div :class="$style['language-wrap']">
      <div v-for="language in languageLists.slice(0, 9)"
        :key="language.value + '_hot'" @click="chooseLanguage(language.value)"
        :class="[$style.language, { [$style['hide-auto']]: hideAuto &&  language.value === 'auto', [$style['selected']]: language.value === value }]">
        {{language.text}}
      </div>
      <div :class="$style.line"></div>
      <div v-for="language in languageLists.slice(9)"
        :key="language.value" @click="chooseLanguage(language.value)"
        :class="[$style.language, { [$style['selected']]: language.value === value }]">
        {{language.text}}
      </div>
    </div>
  </div>
</template>

<script>
  import Vuex from 'vuex'
  import { NavBar } from '@/components'

  export default {
    components: {
      NavBar,
    },

    data() {
      return {
        pageName: browser.i18n.getMessage('language'),
      }
    },

    computed: {
      ...Vuex.mapState([
        'languageLists',
      ]),
      hideAuto() {
        return !!this.$router.currentRoute.query.hideAuto
      },
      value() {
        return this.$router.currentRoute.query.value
      },
    },

    methods: {
      chooseLanguage(value) {
        this.$store.dispatch('CHOOSE_LANGUAGE', {
          value,
          type: this.$router.currentRoute.query.type,
        })
        this.$store.dispatch('TRANSLATE_KEYWORD').catch(() => {})
        this.$router.back()
      },
    }
  }
</script>

<style module>
  .language-wrap {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    padding: 10px 10px 0 10px;
    margin-top: 10px;
    border-radius: 4px;
    background-color: #ffffff;
  }

  .hide-auto {
    visibility: hidden;
  }

  .line {
    width: 100%;
    height: 1px;
    margin-bottom: 15px;
    background-color: #eeeeee;
  }

  .language {
    cursor: pointer;
    width: 30%;
    font-size: 14px;
    color: #333333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 15px;
    transition: color 0.2s;

    &:hover,
    &.selected {
      color: #0abfbc;
    }
  }
</style>

