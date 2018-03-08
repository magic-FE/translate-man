<template>
  <div class="popup">
    <header class="header">
      <Icon class="logo" name="logo"></Icon>
      <Icon class="setting" name="setting"></Icon>
    </header>
    <div class="main">
      <InputBox class="input-box-wrap"></InputBox>
      <OutputBox class="output-box-wrap"></OutputBox>
    </div>
  </div>
</template>

<script>
  import { Icon } from '@/components'
  import InputBox from '../inputBox'
  import OutputBox from '../outputBox'

  export default {
    components: {
      Icon,
      InputBox,
      OutputBox,
    },
  }
</script>

<style scoped>
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
    margin-top: 10px;
  }
</style>
