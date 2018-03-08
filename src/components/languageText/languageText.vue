<template>
  <div>{{text}}</div>
</template>

<script>
  import Vuex from 'vuex'

  export default {
    props: {
      value: {
        type: String,
      },
    },
    computed: {
      ...Vuex.mapState([
        'languageLists',
      ]),
      text() {
        let languageText
        if (this.languageLists) {
          this.languageLists.forEach(language => {
            if (language.value === this.value) {
              languageText = language.text
            }
          })
        }
        return languageText
      }
    },
  }
</script>

