<template>
  <div class="output-box">
    <div class="keyword">{{ translateResult.keyword }}</div>
    <div class="sound">
      <Icon class="sound-icon" name="sound" @mouseover.native="playGoogleSound"></Icon>
      <div v-if="translateResult.phonetic" class="phonetic">[{{ translateResult.phonetic }}]</div>
    </div>
    <div class="result">
      <div v-for="(item, index) in translateResult.translateList"
        :key="index"
        class="result-list">
        <span v-if="item[0]" class="lexical">{{ item[0] }}</span>
        <span class="text">{{ item[1].join('; ') }}</span>
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

<style scoped>
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
    margin-top: 5px;

    .sound-icon {
      cursor: pointer;
      width: 14px;
      margin-right: 7px;
      opacity: 0.8;
      transition: opacity 0.3s;

      &:hover {
        opacity: 1;
      }
    }
  }

  .phonetic {
    font-size: 12px;
  }

  .result {
    margin-top: 10px;
    font-size: 14px;
  }

  .result-list {
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .lexical {
    color: #666666;
    margin-right: 5px;
  }
</style>
