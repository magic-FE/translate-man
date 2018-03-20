<template>
  <div :class="$style['complete-list']" v-if="show && completeList.length">
    <div v-for="(text, index) in completeList"
      :key="index"
      :class="[$style.list, { [$style.selected]: selectedIndex === index }]"
      @click="selectKeyword(index)">
      {{text}}
    </div>
  </div>
</template>

<script>
  import Vuex from 'vuex'

  export default {
    data() {
      return {
        show: true,
        selectedIndex: null,
        searchHandler: null,
        autoTranslateTimeHandler: null,
      }
    },

    computed: {
      ...Vuex.mapState([
        'keyword',
        'completeList',
      ])
    },

    mounted() {
      document.addEventListener('keydown', this.changeKeyword)
    },

    beforeDestroy() {
      clearTimeout(this.searchHandler)
      document.removeEventListener('keydown', this.changeKeyword)
    },

    methods: {
      selectKeyword(index) {
        this.selectedIndex = index
        this.closeList()
      },
      changeKeyword(e) {
        if (e.keyCode === 13) {
          e.preventDefault()
          this.closeList()
        } else if (e.keyCode === 40) {
          this.changeKeywordDown()
        } else if (e.keyCode === 38) {
          this.changeKeywordUp()
        } else {
          clearTimeout(this.autoTranslateTimeHandler)
          this.autoTranslateTimeHandler = setTimeout(() => {
            this.translate()
          }, 500)
        }
      },
      changeKeywordDown() {
        if (!this.completeList) {
          return
        }
        if (this.selectedIndex === null || this.selectedIndex >= this.completeList.length - 1) {
          this.selectedIndex = 0
        } else {
          this.selectedIndex++
        }
      },
      changeKeywordUp() {
        if (!this.completeList) {
          return
        }
        if (this.selectedIndex === null || this.selectedIndex < 1) {
          this.selectedIndex = this.completeList.length - 1
        } else {
          this.selectedIndex--
        }
      },
      closeList() {
        if (this.selectedIndex !== null) {
          this.$store.commit('setKeyword', this.completeList[this.selectedIndex])
        }
        this.translate()
        setTimeout(() => {
          this.show = false
        }, 0)
      },
      translate() {
        this.$store.dispatch('TRANSLATE_KEYWORD').catch(() => {})
      },
      autoComplete() {
        clearTimeout(this.searchHandler)
        this.searchHandler = setTimeout(() => {
          this.$store.dispatch('AUTO_COMPLETE')
        }, 100)
      },
    },

    watch: {
      completeList() {
        this.selectedIndex = null
      },
      keyword(v) {
        if (v) {
          this.show = true
        } else {
          this.show = false
        }
        this.autoComplete()
      },
    },
  }
</script>

<style lang="postcss" module>
  .complete-list {
    font-size: 14px;
    color: #333333;
    box-sizing: border-box;
    border-radius: 0 0 4px 4px;
    margin-bottom: 10px;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 1px 3px #333;
  }

  .list {
    padding: 3px 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &.selected {
      color: #0abfbc;
    }

    &:hover {
      background-color: rgba(155, 155, 155, 0.226);
    }
  }
</style>
