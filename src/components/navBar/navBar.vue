<template>
  <div class="nav-bar" @click="back">
    <Icon class="back-icon" name="arrowLeft"></Icon>
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

<style scoped>
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


