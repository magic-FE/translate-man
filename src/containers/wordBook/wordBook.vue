<template>
  <div>
    <NavBar name="单词本"></NavBar>
    <div :class="$style['word-book-wrap']"></div>
  </div>
</template>

<script>
  import { NavBar } from '@/components'

  export default {
    components: {
      NavBar,
    },
  }
</script>

<style module>
  .word-book-wrap {
    margin-top: 10px;
  }
</style>

