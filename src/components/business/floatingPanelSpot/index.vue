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
        @click-tab="onClickTab"
      >
        <van-tab :title="$t('noun.spotGoods')">
          <selectSpot
            ref="spotSelectSpotRef"
            type="SPOT"
            v-model:searchVal="searchValue"
            @closeModel="showFLoatingPanel"
            @jumpAge="jumpToAge"
          ></selectSpot>
        </van-tab>
        <van-tab :title="$t('noun.futureGoods')">
          <selectSpot
            ref="futureGoodsSelectSpotRef"
            type="FUTURES"
            v-model:searchVal="searchValue"
            @closeModel="showFLoatingPanel"
          ></selectSpot>
        </van-tab>
        <van-tab :title="$t('noun.metalsGoods')">
          <selectSpot
            ref="metalsGoodsSelectSpotRef"
            type="METALS"
            v-model:searchVal="searchValue"
            @closeModel="showFLoatingPanel"
          ></selectSpot>
        </van-tab>
      </van-tabs>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue';
import type { Component } from 'vue';
import selectSpot from '@/components/business/selectSpot/index.vue';

const spotSelectSpotRef: any = ref(null)
const futureGoodsSelectSpotRef: any = ref(null)
const metalsGoodsSelectSpotRef: any = ref(null)
const searchValue = ref('')
const active = ref(0)
const showBottom = ref(false)
const jumpKlineType = ref('') // 跳转的类型，SPOT  FUTURE  METALS

/**
 * 显示浮窗
 * @param data 传递过来的类型，决定查询那种数据
 */
const  showFLoatingPanel = (data: any) => {
  showBottom.value = !showBottom.value;
  jumpKlineType.value = data.type;
  nextTick(() => {
    console.log('data!!!!!', data)
    if (data.type) {
      if(showBottom.value) {
        if (data.type === 'SPOT') {
          active.value = 0
          spotSelectSpotRef.value?.loadData(data.type)
        } else if (data.type === 'FUTURE') {
          active.value = 1
          futureGoodsSelectSpotRef.value?.loadData(data.type) 
        } else if (data.type === 'METALS') {
          active.value = 2
          metalsGoodsSelectSpotRef.value?.loadData(data.type) 
        }
      }
    }
    console.log('跳转', data)
    if (data.jumpType) {
      if (jumpKlineType.value == data.jumpType) {
        showBottom.value =!showBottom.value;
        return
      }
      if (data.jumpType === 'SPOT') {
        uni.switchTab({
          url: '/pages/trade/index'
        })
      } else if (data.jumpType === 'FUTURE') {
        uni.switchTab({
          url: '/pages/contract/index'
        })
      } else if (data.jumpType === 'METALS') {
        // 前往贵金属页面
      }
    }
  })
}

const onClickButton = () => {
  spotSelectSpotRef.value?.searchFun()
}

const onClickTab = (e: any) => {
  nextTick(() => {
    let currentRef : any
    let kType = 'SPOT'
	  switch(active.value){
        case 0:
      currentRef = spotSelectSpotRef
      kType = 'SPOT'
        break
        case 1:
      currentRef = futureGoodsSelectSpotRef
      kType = 'FUTURE'
        break
      case 2:
        currentRef =metalsGoodsSelectSpotRef
        kType = 'METALS'
        default:
	  }
    currentRef.value?.loadData(kType);
  })
}

const jumpToAge = (data: any) => {
  console.log('123', data.type)
  // 如果在当前选择的类型下，就关闭浮窗
  if (jumpKlineType.value === data.type) {
    showBottom.value = !showBottom.value;
    return
  }
  showBottom.value = !showBottom.value;
  if (data.type === 'SPOT') {
    uni.switchTab({
      url: '/pages/trade/index'
    })
  } else if (data.type === 'FUTURE') {
    uni.switchTab({
      url: '/pages/contract/index'
    })
  } else if (data.type === 'METALS') {
    // 前往贵金属页面
	uni.switchTab({
	  url: '/pages/metals/index'
	})
  }
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