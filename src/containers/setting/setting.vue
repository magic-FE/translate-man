<template>
  <div>
    <NavBar name="设置"></NavBar>
    <div class="setting-wrap">
      <div class="user-info">
        <div class="list">
          <div>我的账号</div>
          <img class="avatar" src="" alt="">
        </div>
        <div class="list">
          <div>昵称</div>
          <div class="gray">罗密</div>
        </div>
        <div class="list">
          <div>单词本</div>
          <Icon class="word-book-icon" name="arrowRightGray" @click.native="goToWordBook"></Icon>
        </div>
      </div>
      <div class="user-setting">
        <div class="list">
          <div>网页翻译为</div>
          <LanguageText class="gray" :value="userSetting.webLanguage" @click.native="openLanguage"></LanguageText>
        </div>
        <div class="list">
          <div>双击单词翻译</div>
          <Switches :value="userSetting.doubleClick" @input="changeDoubleClick" theme="custom" color="green"></Switches>
        </div>
        <div class="list">
          <div>划词后自动翻译</div>
          <Switches :value="userSetting.stroke" @input="changeStroke" theme="custom" color="green"></Switches>
        </div>
        <div class="list">
          <div>悬停单词后翻译</div>
          <Switches :value="userSetting.hover" @input="changeHover" theme="custom" color="green"></Switches>
        </div>
        <div class="list">
          <div>选中后按键翻译</div>
          <div>
            <Switches :value="userSetting.pressKey" @input="changePressKey" theme="custom" color="green"></Switches>
          </div>
        </div>
        <div class="list">
          <div>自动发音</div>
          <Switches :value="userSetting.autoSound" @input="changeAutoSound" theme="custom" color="green"></Switches>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vuex from 'vuex'
  import Switches from 'vue-switches'
  import { Icon, NavBar, LanguageText } from '@/components'

  export default {
    components: {
      NavBar,
      Icon,
      LanguageText,
      Switches,
    },

    data() {
      return {
        doubleClick: true,
      }
    },

    computed: {
      ...Vuex.mapState([
        'userSetting',
      ])
    },

    methods: {
      changeDoubleClick(v) {
        this.$store.commit('setDoubleClick', v)
      },
      changeStroke(v) {
        this.$store.commit('setStroke', v)
      },
      changeHover(v) {
        this.$store.commit('setHover', v)
      },
      changePressKey(v) {
        this.$store.commit('setPressKey', v)
      },
      changeAutoSound(v) {
        this.$store.commit('setAutoSound', v)
      },
      goToWordBook() {
        this.$router.replace({ name: 'wordbook' })
      },
      openLanguage() {
        this.$router.push({
          name: 'language',
          query: {
            type: 'web',
            value: this.userSetting.webLanguage,
            hideAuto: true,
          }
        })
      },
    },
  }
</script>

<style>
  .vue-switcher-theme--custom {
    background-color: transparent;

    &.vue-switcher-color--green {
      div {
        background-color: #acacac;

        &:after {
            background-color: #2cccc9;
        }
      }

      &.vue-switcher--unchecked {
        div {
          background-color: #acacac;

          &:after {
            background-color: #8d8d8d;
          }
        }
      }
    }
  }
</style>


<style scoped>
  .setting-wrap {
    margin-top: 10px;
    padding: 15px 0;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.9);
  }

  .user-info {
    background-color: #ffffff;
  }

  .user-setting {
    margin-top: 15px;
    background-color: #ffffff;
  }

  .list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: #333333;
    margin: 0 10px;
    padding: 7px 0;
    border-bottom: 1px solid #eeeeee;

    .gray {
      cursor: pointer;
      color: #999999;
    }

    &:last-child {
      border-bottom: 0;
    }
  }

  .avatar {
    display: block;
    width: 36px;
    height: 36px;
  }

  .word-book-icon {
    width: 16px;
  }
</style>


