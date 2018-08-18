<template>
  <div :class="$style['output-box']">
    <div :class="$style['keyword-wrap']">
      <span :class="$style.keyword" v-html="translateResult.keyword"></span>
      <Icon v-if="isShowDropDown"
        :class="[$style['drow-down-icon'], { [$style.show]: isShowMore }]"
        @click.native="showMore"
        name="drowDown"></Icon>
    </div>
    <div :class="$style.sound">
      <div v-if="translateResult.phonetic" :class="$style.phonetic">[{{ translateResult.phonetic }}]</div>
      <Icon :class="$style['sound-icon']" :name="isHoverSound ? 'soundHover' : 'sound'" @mouseover.native="playGoogleSound" @mouseout.native="stopGoogleSound"></Icon>
    </div>
    <div :class="$style.result">
      <div v-for="(item, index) in translateResult.translateList"
        :key="index"
        :class="$style['result-list']">
        <span v-if="item[0]" :class="$style.lexical">{{ item[0] }}</span>
        <span :class="$style.text" v-html="item[1].join('; ')"></span>
      </div>
    </div>
    <transition name="fade">
      <div :class="$style.more" v-show="isShowMore">
        <div :class="$style['sub-title']" v-if="translateResult.definition.length">{{ definition }}</div>
        <div v-for="(item, index) in translateResult.definition"
          :key="`d_${index}`"
          :class="$style['result-list']">
          <span :class="$style.lexical">{{ item[0] }}</span>
          <span :class="$style.text">{{ item[1] && item[1][0] && item[1][0][0] }}</span>
        </div>
        <div :class="$style['sub-title']" v-if="translateResult.synonym.length">{{ synonym }}</div>
        <div v-for="(item, index) in translateResult.synonym"
          :key="`s_${index}`"
          :class="$style['result-list']">
          <span :class="$style.lexical">{{ item[0] }}</span>
          <span :class="$style.text">{{ item[1] && item[1][0] && item[1][0][0].join('; ') }}</span>
        </div>
        <div :class="$style['sub-title']" v-if="translateResult.example">{{ example }}</div>
        <div v-html="translateResult.example"></div>
      </div>
    </transition>
  </div>
</template>

<script>
  import Vuex from 'vuex'
  import { Icon } from '@/components'

  export default {
    components: {
      Icon,
    },

    data() {
      return {
        isHoverSound: false,
        definition: browser.i18n.getMessage('definition'),
        synonym: browser.i18n.getMessage('synonym'),
        example: browser.i18n.getMessage('example'),
      }
    },

    computed: {
      ...Vuex.mapState([
        'translateResult',
        'isShowMore',
      ]),
      isShowDropDown() {
        return this.translateResult.definition.length ||
          this.translateResult.synonym.length ||
          this.translateResult.example
      },
    },

    methods: {
      playGoogleSound() {
        this.isHoverSound = true
        this.$store.dispatch('GOOGLE_SOUND')
      },
      stopGoogleSound() {
        this.isHoverSound = false
      },
      showMore() {
        this.$store.commit('setIsShowMore', !this.isShowMore)
      },
    },
  }
</script>

<style lang="postcss" module>
  .output-box {
    color: #333333;
    border-radius: 4px;
  }

  .keyword-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .keyword {
    flex: 1;
    font-size: 20px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .drow-down-icon {
    cursor: pointer;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    margin-left: 10px;
    transition: transform 0.2s;

    &.show {
      transform: rotate(180deg);
    }
  }

  .sound {
    display: flex;
    align-items: center;
    margin-top: 2px;

    .sound-icon {
      cursor: pointer;
      width: 14px;
      height: 14px;
      flex-shrink: 0;
    }
  }

  .phonetic {
    color: #666666;
    font-size: 14px;
    margin-right: 7px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .result {
    margin-top: 5px;
    font-size: 14px;
  }

  .result-list {
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;
    margin-bottom: 5px;
    line-height: 1.4;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .lexical {
    max-width: 60px;
    white-space: nowrap;
    color: #888683;
    margin-right: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .text {
    flex: 1;
    word-break: break-all;
  }

  .sub-title {
    font-size: 14px;
    margin: 10px 0 5px;
  }

  .more {
    font-size: 12px;
    margin-top: 10px;
  }
</style>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .2s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>



