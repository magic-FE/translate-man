<template>
  <div :class="$style.app">
    <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
  export default {}
</script>

<style module>
  .app {
    font-family: 'Helvetica Neue', Tahoma, Arial, PingFangSC-Regular, 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
    box-sizing: border-box;
    width: 320px;
    padding: 10px;
    background-image: linear-gradient(to bottom, #27b5b2, #0abfbc);
  }
</style>



