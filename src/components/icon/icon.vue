<template>
  <div :class="$style.icon">
     <img :class="$style.icon" :src="iconMaps[name]">
  </div>
</template>

<script>
  import logo from './svg/logo.svg'
  import arrowLeft from './svg/arrowLeft.svg'
  import arrowRightWhite from './svg/arrowRightWhite.svg'
  import arrowRightGray from './svg/arrowRightGray.svg'
  import setting from './svg/setting.svg'
  import sound from './svg/sound.svg'
  import soundHover from './svg/soundHover.svg'
  import star from './svg/star.svg'
  import stared from './svg/stared.svg'
  import github from './svg/github.svg'
  import drowDown from './svg/drowDown.svg'
  import wechat from './img/wechat.png'
  import alipay from './img/alipay.png'

  const iconMaps = {
    logo,
    arrowLeft,
    arrowRightWhite,
    arrowRightGray,
    setting,
    sound,
    soundHover,
    star,
    stared,
    github,
    drowDown,
    wechat,
    alipay,
  }

  Object.keys(iconMaps).forEach(key => {
    iconMaps[key] = browser.extension.getURL(iconMaps[key])
  })

  export default {
    props: {
      name: {
        type: String,
      },
    },

    data() {
      return {
        iconMaps,
      }
    },
  }
</script>

<style lang="postcss" module>
  .icon {
    display: block;
    width: 100%;
    height: 100%;
    border: none !important;
  }
</style>


