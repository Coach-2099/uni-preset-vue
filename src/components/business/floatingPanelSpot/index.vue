<template>
  <van-popup
    v-model:show="showBottom"
    position="bottom"
    round
    lock-scroll
    lazy-render
    :style="{ height: '90%', display: 'flex', flexDirection: 'column'}"
  >
    <div class="searchModule bg-white pt-15 pos-fixed w-100 pr-5">
      <van-search
        show-action
        v-model="searchValue"
        placeholder="BTC/USDT"
        @search="onClickButton"
      >
        <template #action>
          <div class="text-black fs-14" @click="onClickButton">搜索</div>
        </template>
      </van-search>
    </div>
    <div class="quotesList" style="flex: 1; overflow-y: auto;">
      <van-tabs
        v-model:active="active"
        shrink
      >
        <van-tab title="热门">
          <selectSpot
            ref="spotSelectSpotRef"
            type="SPOT"
            v-model:searchVal="searchValue"
          ></selectSpot>
        </van-tab>
        <van-tab title="新币榜">新币榜</van-tab>
        <van-tab title="涨幅榜">涨幅榜</van-tab>
        <van-tab title="跌幅榜">跌幅榜</van-tab>
        <van-tab title="成交额">成交额</van-tab>
      </van-tabs>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue';
import type { Component } from 'vue';
import selectSpot from '@/components/business/selectSpot/index.vue';

const spotSelectSpotRef: any = ref(null)
const searchValue = ref('')
const active = ref(0)
const showBottom = ref(false)

const  showFLoatingPanel = () => {
  showBottom.value = !showBottom.value;
  if(showBottom.value) {
    nextTick(() => {
      spotSelectSpotRef.value?.loadData()
    })
  }
}

const onClickButton = () => {
  spotSelectSpotRef.value?.searchFun()
}

// 将方法暴露给父组件
defineExpose({
  showFLoatingPanel
})

</script>

<style lang="scss" scoped>
.searchModule {
  width: 100%;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  z-index: 99;
}
.quotesList {
  margin-top: 70px;
  height: calc(100% - 70px);
  overflow-y: auto;
  position: relative;
}
</style>