<template>
  <div>
    <NavBar name="语言"></NavBar>
    <div class="language-wrap">
      <div v-for="language in languageLists.slice(0, 9)"
        :key="language.value + '_hot'" @click="chooseLanguage(language.value)"
        class="language">
        {{language.text}}
      </div>
      <div class="line"></div>
      <div v-for="language in languageLists.slice(9)"
        :key="language.value" @click="chooseLanguage(language.value)"
        class="language">
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

    computed: {
      ...Vuex.mapState([
        'languageLists',
      ])
    },

    methods: {
      chooseLanguage(value) {
        this.$store.dispatch('CHOOSE_LANGUAGE', {
          value,
          type: this.$router.currentRoute.query.type,
        })
        this.$router.back()
      },
    }
  }
</script>

<style scoped>
  .language-wrap {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    padding: 10px 10px 0 10px;
    margin-top: 10px;
    border-radius: 4px;
    background-color: #ffffff;
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

    &:hover {
      color: #0abfbc;
    }
  }
</style>

