<template>
  <div :class="$style['output-box']">
    <div :class="$style.keyword">{{ translateResult.keyword }}</div>
    <div :class="$style.sound">
      <div v-if="translateResult.phonetic" :class="$style.phonetic">[{{ translateResult.phonetic }}]</div>
      <Icon :class="$style['sound-icon']" name="sound" @mouseover.native="playGoogleSound"></Icon>
    </div>
    <div :class="$style.result">
      <div v-for="(item, index) in translateResult.translateList"
        :key="index"
        :class="$style['result-list']">
        <span v-if="item[0]" :class="$style.lexical">{{ item[0] }}</span>
        <span :class="$style.text">{{ item[1].join('; ') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import Vuex from 'vuex'
  import { Icon } from '@/components'

  export default {
    components: {
      Icon,
    },

    computed: {
      ...Vuex.mapState([
        'translateResult',
      ])
    },

    methods: {
      playGoogleSound() {
        this.$store.dispatch('GOOGLE_SOUND')
      }
    },
  }
</script>

<style module>
  .output-box {
    color: #333333;
    border-radius: 4px;
  }

  .keyword {
    font-size: 20px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .sound {
    display: flex;
    align-items: center;
    margin-top: 10px;

    .sound-icon {
      cursor: pointer;
      width: 14px;
    }
  }

  .phonetic {
    color: #666666;
    font-size: 14px;
    margin-right: 7px;
  }

  .result {
    margin-top: 10px;
    font-size: 14px;
  }

  .result-list {
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;
    margin-bottom: 5px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .lexical {
    color: #888683;
    margin-right: 5px;
  }

  .text {
    flex: 1;
  }
</style>

