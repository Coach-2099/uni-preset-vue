<template>
  <van-popup
    v-model:show="showBottom"
    position="bottom"
    round
    lock-scroll
    lazy-render
    :before-close="beforeClose"
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
          <div class="text-black fs-14" @click="onClickButton">{{$t('common.search')}}</div>
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
            ref="SelectSpotRef"
            type="SPOT"
            v-model:searchVal="searchValue"
            @closeModel="showFLoatingPanel"
          ></selectSpot>
        </van-tab>
        <van-tab :title="$t('noun.futureGoods')">
          <selectSpot
            ref="SelectFutureGoodsRef"
            type="FUTURES"
            v-model:searchVal="searchValue"
            @closeModel="showFLoatingPanel"
          ></selectSpot>
        </van-tab>
        <van-tab :title="$t('noun.metalsGoods')">
          <selectSpot
            ref="SelectMetalsGoodsRef"
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
import { nextTick, ref, computed } from 'vue';
import type { Component } from 'vue';
import selectSpot from '@/components/business/selectSpot/index.vue';
import { onShow } from '@dcloudio/uni-app';

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
const SelectSpotRef: any = ref(null)
const SelectFutureGoodsRef: any = ref(null)
const SelectMetalsGoodsRef: any = ref(null)
const searchValue = ref('')
const active = ref(0)
const showBottom = ref(false)
const jumpKlineType = ref('') // 跳转的类型，SPOT  FUTURE  METALS
const socketService = computed(() => userStore.socketService);
/**
 * 显示浮窗
 * @param data 传递过来的类型，决定查询那种数据
 */
const showFLoatingPanel = (data: any) => {
  showBottom.value = !showBottom.value;
  jumpKlineType.value = data.type;
  nextTick(() => {
    console.log('data!!!!!', data)
    if (data.type) {
      // 此处是加载数据
      if(showBottom.value) {
        if (data.type === 'SPOT') {
          active.value = 0
          nextTick(() => {
            SelectSpotRef.value?.loadData(data.type)
          })
        } else if (data.type === 'FUTURES') {
          active.value = 1
          nextTick(() => {
            SelectFutureGoodsRef.value?.loadData(data.type) 
          })
        } else if (data.type === 'METALS') {
          active.value = 2
          nextTick(() => {
            SelectMetalsGoodsRef.value?.loadData(data.type) 
          })
        }
      }
    }
    console.log('跳转', data)
    // 此处是选中货币后 则跳转到相关页面
    if (data.jumpType) {
	  socketService.value.unsubscribe('ticker');
      if (jumpKlineType.value == data.jumpType) {
        showBottom.value =!showBottom.value;
        return
      }
      if (data.jumpType === 'SPOT') {
        uni.switchTab({
          url: '/pages/trade/index'
        })
      } else if (data.jumpType === 'FUTURES') {
        uni.switchTab({
          url: '/pages/contract/index'
        })
      } else if (data.jumpType === 'METALS') {
		   uni.switchTab({
			 url: '/pages/metals/index'
		   })
      }
    }
  })
}

const onClickButton = () => {
  if (jumpKlineType.value == 'SPOT') {
    SelectSpotRef.value?.searchFun()
  } else if (jumpKlineType.value == 'FUTURE') {
    SelectFutureGoodsRef.value?.searchFun()
  } else if (jumpKlineType.value == 'METALS') {
    SelectMetalsGoodsRef.value?.searchFun()
  }
}

const onClickTab = (e: any) => {
  nextTick(() => {
    let currentRef : any
    let kType = 'SPOT'
	  switch(active.value){
        case 0:
      currentRef = SelectSpotRef
      kType = 'SPOT'
        break
        case 1:
      currentRef = SelectFutureGoodsRef
      kType = 'FUTURES'
        break
      case 2:
        currentRef =SelectMetalsGoodsRef
        kType = 'METALS'
        default:
	  }
    currentRef.value?.loadData(kType);
  })
}

// 关闭页面 停止ws
const beforeClose = () => {
  showBottom.value =!showBottom.value;
  socketService.value.unsubscribe('ticker');
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