<template>
  <div>
    <Icon class="logo" name="logo"></Icon>
    <h1>Popup Page</h1>
  </div>
</template>

<script>
  import { Icon } from '@/components'

  export default {
    components: {
      Icon,
    },
  }
</script>

<style scoped>
  .logo {
    width: 128px;
    height: 128px;
  }
</style>
