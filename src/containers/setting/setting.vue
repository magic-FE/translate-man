<template>
  <div>
    <NavBar :name="pageName"></NavBar>
    <div :class="$style['setting-wrap']">
      <!-- <div :class="$style['user-info']">
        <div :class="$style.list">
          <div>我的账号</div>
          <img :class="$style.avatar" src="" alt="">
        </div>
        <div :class="$style.list">
          <div>昵称</div>
          <div :class="$style.gray">罗密</div>
        </div>
        <div :class="$style.list">
          <div>单词本</div>
          <Icon :class="$style['word-book-icon']" name="arrowRightGray" @click.native="goToWordBook"></Icon>
        </div>
      </div> -->
      <div :class="$style['user-setting']">
        <div :class="$style.list">
          <div :title="webLanguageTip">{{ webLanguageText }}</div>
          <LanguageText :class="$style.gray" :value="userSetting.webLanguage" @click.native="openLanguage"></LanguageText>
        </div>
        <div :class="$style.list">
          <div :title="doubleClickTip">{{ doubleClickText }}</div>
          <Switches :value="userSetting.doubleClick" @click.native="changeDoubleClick" theme="custom" color="green"></Switches>
        </div>
        <div :class="$style.list">
          <div :title="strokeTip">{{ strokeText }}</div>
          <Switches :value="userSetting.stroke" @click.native="changeStroke" theme="custom" color="green"></Switches>
        </div>
        <div :class="$style.list">
          <div :title="pressKeyTip">{{ pressKeyText }}</div>
          <div>
            <input :class="[$style.gray, $style['setting-input']]" :value="userSetting.pressKeyString" @keyup.stop="changePressKeyString" ref="pressKeyString" />
            <Switches :value="userSetting.pressKey" @click.native="changePressKey" theme="custom" color="green"></Switches>
          </div>
        </div>
        <div :class="$style.list">
          <div :title="hoverTip">{{ hoverText }}</div>
          <div>
            <input :class="[$style.gray, $style['setting-input'], $style['hover-time']]" :value="userSetting.hoverTime" @blur="changeHoverTime" ref="hoverTime" />
            <span :class="[$style['hover-time-s']]">s</span>
            <Switches :value="userSetting.hover" @click.native="changeHover" theme="custom" color="green"></Switches>
          </div>
        </div>
        <div :class="$style.list">
          <div :title="autoSoundTip">{{ autoSoundText }}</div>
          <Switches :value="userSetting.autoSound" @click.native="changeAutoSound" theme="custom" color="green"></Switches>
        </div>
      </div>
      <div :class="$style['about-setting']">
        <div :class="$style.list" style="cursor: pointer;" @click="goToAbout">
          <div>{{ about }}</div>
          <Icon :class="$style['about-icon']" name="arrowRightGray"></Icon>
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
        pageName: browser.i18n.getMessage('setting'),
        about: browser.i18n.getMessage('about'),
        webLanguageText: browser.i18n.getMessage('web_language'),
        webLanguageTip: browser.i18n.getMessage('web_language_tip'),
        doubleClickText: browser.i18n.getMessage('dblclick_translate'),
        doubleClickTip: browser.i18n.getMessage('dblclick_translate_tip'),
        strokeText: browser.i18n.getMessage('storke_translate'),
        strokeTip: browser.i18n.getMessage('storke_translate_tip'),
        pressKeyText: browser.i18n.getMessage('press_key_translate'),
        pressKeyTip: browser.i18n.getMessage('press_key_translate_tip'),
        hoverText: browser.i18n.getMessage('hover_translate'),
        hoverTip: browser.i18n.getMessage('hover_translate_tip'),
        autoSoundText: browser.i18n.getMessage('auto_sound_translate'),
        autoSoundTip: browser.i18n.getMessage('auto_sound_translate_tip'),
      }
    },

    computed: {
      ...Vuex.mapState([
        'userSetting',
      ])
    },

    methods: {
      changeDoubleClick() {
        this.$store.commit('setDoubleClick', !this.userSetting.doubleClick)
      },
      changeStroke() {
        this.$store.commit('setStroke', !this.userSetting.stroke)
      },
      changePressKey() {
        this.$store.commit('setPressKey', !this.userSetting.pressKey)
      },
      changePressKeyString(e) {
        this.$refs.pressKeyString.value = e.key
        this.$store.commit('setPressKeyString', e.key)
      },
      changeHover() {
        this.$store.commit('setHover', !this.userSetting.hover)
      },
      changeHoverTime(e) {
        const value = parseFloat(e.target.value)
        if (value >= 0 && value <= 10) {
          this.$store.commit('setHoverTime', value)
        } else {
          this.$refs.hoverTime.value = this.userSetting.hoverTime
        }
      },
      changeAutoSound() {
        this.$store.commit('setAutoSound', !this.userSetting.autoSound)
      },
      goToWordBook() {
        this.$router.replace({ name: 'wordbook' })
      },
      goToAbout() {
        this.$router.replace({ name: 'about' })
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


<style lang="postcss" module>
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
    background-color: #ffffff;
  }

  .about-setting {
    margin-top: 10px;
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

  .about-icon {
    width: 16px;
  }

  .setting-input {
    display: inline-block;
    width: 40px;
    text-align: center;
    border: 0;
    border-bottom: 1px solid #eeeeee;
    outline: none;
    margin-right: 5px;
  }

  .hover-time-s {
    color: #999999;
    position: relative;
    left: -12px;
  }
</style>


