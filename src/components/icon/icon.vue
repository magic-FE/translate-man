<template>
  <div>
     <img class="icon" :src="iconMaps[name]">
  </div>
</template>

<script>
  import logo from './svg/logo.svg'

  const iconMaps = {
    logo,
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

<style scoped>
  .icon {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>


