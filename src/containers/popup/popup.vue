<template>
  <div :class="$style.popup">
    <header :class="$style.header">
      <Icon :class="$style.logo" name="logo"></Icon>
      <Icon :class="$style.setting" name="setting" @click.native="goToSetting"></Icon>
    </header>
    <div :class="$style.main">
      <InputBox :class="$style['input-box-wrap']"></InputBox>
      <OutputBox v-if="translateResult.keyword" :class="$style['output-box-wrap']"></OutputBox>
    </div>
  </div>
</template>

<script>
  import Vuex from 'vuex'
  import { Icon } from '@/components'
  import InputBox from '../inputBox'
  import OutputBox from '../outputBox'

  export default {
    components: {
      Icon,
      InputBox,
      OutputBox,
    },

    computed: {
      ...Vuex.mapState([
        'translateResult',
      ])
    },

    methods: {
      goToSetting() {
        this.$router.push({ name: 'setting' })
      },
    },
  }
</script>

<style lang="postcss" module>
  .header {
    display: flex;
    justify-content: center;
    position: relative;
  }

  .logo {
    width: 36px;
  }

  .setting {
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    transition: transform 0.3s linear;

    &:hover {
      transform: rotate(90deg);
    }
  }

  .input-box-wrap {
    margin-top: 15px;
  }

  .output-box-wrap {
    padding: 10px;
    margin-top: 10px;
    background-color: #ffffff;
  }
</style>
