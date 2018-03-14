<template>
  <div>
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

<style module>
  .icon {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>


