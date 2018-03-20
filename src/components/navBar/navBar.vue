<template>
  <div :class="$style['nav-bar']" @click="back">
    <Icon :class="$style['back-icon']" name="arrowLeft"></Icon>
    <div>{{name}}</div>
  </div>
</template>

<script>
  import Icon from '../icon'

  export default {
    props: {
      name: {
        type: String,
      },
    },

    components: {
      Icon,
    },

    methods: {
      back() {
        this.$router.back()
      },
    },
  }
</script>

<style lang="postcss" module>
  .nav-bar {
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;
    color: #ffffff;
  }

  .back-icon {
    width: 14px;
    margin-right: 5px;
  }
</style>


