<template>
  <div>
    <NavBar :name="pageName"></NavBar>
    <div :class="$style['about-wrap']">
      <div :class="$style.title">{{ appName }}</div>
      <div :class="$style.desciption">{{ description }}</div>
      <div :class="$style.contact">
        <Icon :class="$style.github" title="github" name="github" @click.native="goToGithub"></Icon>
        <div :class="$style.email">844033231@qq.com</div>
      </div>
      <div :class="$style['about-desc']">{{ aboutDesc }}</div>
      <div :class="$style.code">
        <div :class="$style['code-box']">
          <Icon :class="$style.wechat" name="wechat"></Icon>
          <div>微信</div>
        </div>
        <div :class="$style['code-box']">
          <Icon :class="$style.alipay" name="alipay"></Icon>
          <div>支付宝</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Icon, NavBar } from '@/components'

  export default {
    components: {
      Icon,
      NavBar,
    },

    data() {
      return {
        pageName: browser.i18n.getMessage('about'),
        appName: browser.i18n.getMessage('app_name'),
        description: browser.i18n.getMessage('app_description'),
        aboutDesc: browser.i18n.getMessage('about_description'),
      }
    },

    methods: {
      goToGithub() {
        browser.tabs.create({ url: 'https://github.com/magic-FE/translate-man' })
      },
    },
  }
</script>

<style lang="postcss" module>
  .about-wrap {
    margin-top: 10px;
    padding: 15px 10px;
    border-radius: 4px;
    background-color: #ffffff;
  }

  .title {
    text-align: center;
    font-size: 18px;
    color: #333333;
  }

  .desciption {
    font-size: 14px;
    color: #666666;
    margin-top: 10px;
    word-break: break-all;
  }

  .contact {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
  }

  .github {
    cursor: pointer;
    width: 16px;
  }

  .email {
    margin-left: 10px;
    color: #666666;
  }

  .about-desc {
    font-size: 14px;
    color: #666666;
    word-break: break-all;
  }

  .code {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #666666;
    margin-top: 10px;
  }

  .code-box {
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: center;
    width: 40%;

    &:first-child {
      margin-right: 15px;
    }
  }

  .wechat,
  .alipay {
    width: 100%;
  }
</style>

