<template>
  <div class="contract-index">
    <div class="top bg-white">
      <div class="switch-container-box bg-white pos-fixed w-100 flex justify-between">
        <div class="w-100 pos-relative switch-container flex justify-between">
          <div 
            class="switch-item fs-14" 
            :class="{ active: activeTab === 'left' }"
            @click="switchTab('left')"
          >走势图</div>
          <div 
            class="switch-item fs-14" 
            :class="{ active: activeTab === 'right' }"
            @click="switchTab('right')"
          >交易</div>
          <div 
            class="slider"
            :style="sliderStyle"
          ></div>
        </div>
      </div>
      <div v-if="activeTab === 'left'">
        <trendChart></trendChart>
      </div>
      <div v-if="activeTab === 'right'">
        <tradingFunArea buyAndSellType="contract"></tradingFunArea>
      </div>
    </div>
    <div class="bottom bg-white mt-5 px-10">
      <van-tabs v-model:active="active" offset-top="74" shrink sticky>
        <van-tab title="订单">
          <realTimeTransactions ref="realTimeTransactionsRef"></realTimeTransactions>
        </van-tab>
        <van-tab v-if="activeTab === 'left'" title="成交">
          <transactionOrder></transactionOrder>
        </van-tab>
        <van-tab v-if="activeTab === 'right'" title="仓位">
          <positionOrder></positionOrder>
        </van-tab>
      </van-tabs>
    </div>
    <div v-if="activeTab === 'left'" class="btnBox pos-fixed w-100 flex">
      <van-button class="buyBtn flex-1" type="success">Buy</van-button>
      <van-button class="sellBtn flex-1" type="danger">Sell</van-button>
    </div>
    <CustomNavBar></CustomNavBar>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { onShow,onLoad } from "@dcloudio/uni-app";
import CustomNavBar from '@/components/customNavBar/index.vue';
import trendChart from '@/components/trendChart/index.vue';
import realTimeTransactions from '@/components/business/realTimeTransactions/index.vue'
import transactionOrder from '@/components/business/transactionOrder/index.vue'
import positionOrder from '@/components/business/positionOrder/index.vue'
import tradingFunArea from '@/components/business/tradingFunArea/index.vue'
import { useControlStore } from '@/stores/control';

const controlStore = useControlStore();


const active = ref(0)
const activeTab = ref<'left' | 'right'>('left');
const switchTab = (tab: 'left' | 'right') => {
  activeTab.value = tab;
};
const realTimeTransactionsRef: any = ref(null)
const symbol = ref('BTC/USDT') //默认交易对

onLoad(() => {
  // 修正类型错误，确保赋值为 'left' 或 'right'
  activeTab.value = controlStore.quotesData.activeType || 'left';
})

onShow(() => {
	if(controlStore.quotesData.symbol){
		  symbol.value= controlStore.quotesData.symbol
	}
	if(activeTab.value === 'left'){
		realTimeTransactionsRef.value?.loadData({  //调用深度行情，只有在K线图页面才处理
		  klineType: 'FUTURES',
		  symbol: symbol.value
		})
	}
})

const sliderStyle = computed(() => ({
  transform: `translateX(${activeTab.value === 'left' ? '0' : '100%'})`,
  width: '50%' // 与switch-item宽度匹配
}))

</script>

<style lang="scss">
.contract-index {
  background: #F6F7FB;
  .top {
    padding: 20rpx;
    .switch-container-box {
      left: 0;
      top: 0;
      padding: 20rpx;
      z-index: 29;
      height: 50px;
      .switch-container {
        height: 28px;
        border-radius: 6px;
        overflow: hidden;
        gap: 10px;
        .switch-item {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: color 0.2s ease;
          position: relative;
          z-index: 1;
          border-radius: 6px  6px  6px  6px;
          background: #F6F7FB;
          color: #B0B0B0;
          &.active {
            color: #FFFFFF;
            background-color: #1777FF;
          }
        }
  
        .slider {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background: #fff;
          // box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 6px;
        }
      }
    }
  }

  .btnBox {
    padding: 8px;
    bottom: 80px;
    left: 0px;
    right:0px;
    gap: 7px;
    height: 50px;
    background: #fff;
    .van-button {
      border-radius: 6px;
      height: 40px;
    }
    .buyBtn {
      background: #18B86D;
    }
    .sellBtn {
      background: #FF454E;
    }
  }

}
:deep(.van-tabs) {
  .van-sticky {
    .van-tabs__wrap {
      border-bottom: 2px solid #f6f7fb !important;
    }
  }
}
</style>