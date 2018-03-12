<template>
  <div class="app"
    ref="app"
    @dblclick.stop
    @mousemove.stop
    @mousedown.stop
    @mouseup.stop>
    <OutputBox></OutputBox>
  </div>
</template>

<script>
  import Vuex from 'vuex'
  import OutputBox from './containers/outputBox'
  import { getWordFromPoint } from './utils'

  export default {
    components: {
      OutputBox,
    },

    data() {
      return {
        mouseX: 0,
        mouseY: 0,
        pageX: 0,
        pageY: 0,
        isPressKey: false,
        selectStartTimer: null,
      }
    },

    computed: {
      ...Vuex.mapState([
        'userSetting',
      ]),
    },

    mounted() {
      document.addEventListener('dblclick', this.doubleClick)
      document.addEventListener('mousemove', this.mouseMove)
      document.addEventListener('mousedown', this.mouseDown)
      document.addEventListener('mouseup', this.mouseUp)
      window.addEventListener('keydown', this.keyDown)
      window.addEventListener('keyup', this.keyUp)
    },

    methods: {
      hide() {
        this.$store.commit('reset')
      },
      resizePosition() {
        const containerWrap = this.$refs.app
        const containerWrapHeight = parseInt(window.getComputedStyle(containerWrap).height, 10)
        const containerWrapWidth = parseInt(window.getComputedStyle(containerWrap).width, 10)

        if (this.pageX > document.body.scrollWidth - containerWrapWidth - 50) {
          containerWrap.style.left = `${this.pageX - containerWrapWidth - 5}px`
        } else {
          containerWrap.style.left = `${this.pageX + 5}px`
        }

        if (this.pageY > document.body.scrollHeight - containerWrapHeight - 50) {
          containerWrap.style.top = `${this.pageY - containerWrapHeight - 15}px`
        } else {
          containerWrap.style.top = `${this.pageY + 15}px`
        }
      },
      mouseMove(e) {
        this.mouseX = e.clientX
        this.mouseY = e.clientY
        this.pageX = e.pageX
        this.pageY = e.pageY
      },
      mouseDown() {
        this.selectStartTimer = new Date().getTime()
        this.hide()
      },
      mouseUp() {
        if (this.userSetting.stroke) {
          if (new Date().getTime() - this.selectStartTimer > 300) {
            const word = window.getSelection().toString()
            this.translate(word)
          }
        }
      },
      keyDown(e) {
        console.log(e)
        if (this.userSetting.pressKey && e.keyCode === this.userSetting.presskeyCode) {
          this.isPressKey = true
        } else {
          this.isPressKey = false
        }
      },
      keyUp() {
        if (this.userSetting.pressKey && this.isPressKey) {
          let word = window.getSelection().toString()

          if (!word) {
            word = getWordFromPoint(this.mouseX, this.mouseY, this.$refs.app)
          }
          console.log(word)
          this.translate(word)
        } else {
          this.hide()
        }
      },
      doubleClick() {
        if (this.userSetting.doubleClick) {
          const word = window.getSelection().toString()
          if (word) {
            this.translate(word)
          }
        }
      },
      translate(word) {
        this.$store.dispatch('WEB_TRANSLATE_KEYWORD', word).then(() => {
          this.$nextTick(() => {
            this.resizePosition()
          })
        })
      },
    },
  }
</script>

<style scoped>
  .app {
    position: absolute;
    left: 0;
    top: 0;
    font-family: 'Helvetica Neue', Tahoma, Arial, PingFangSC-Regular, 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
    min-width: 0;
    max-width: 320px;
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid #eeeeee;
    background-color: rgba(255, 255, 255, 0.95);
  }
</style>



