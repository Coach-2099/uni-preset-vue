<template>
  <div class="contract-index pos-relative">
    <div class="top bg-white">
      <div class="switch-container-box bg-white pos-fixed w-100 flex justify-between">
        <div class="w-100 pos-relative switch-container flex justify-between">
          <div 
            class="switch-item fs-14" 
            :class="{ active: activeTab === 'left' }"
            @click="switchTab('left')"
          >{{ $t('noun.trendChart') }}</div>
          <div 
            class="switch-item fs-14" 
            :class="{ active: activeTab === 'right' }"
            @click="switchTab('right')"
          >{{ $t('noun.trade') }}</div>
          <div 
            class="slider"
            :style="sliderStyle"
          ></div>
        </div>
      </div>
      <div class="tabBox">
        <div v-if="activeTab === 'left'">
          <trendChart type="FUTURES"></trendChart>
        </div>
        <div v-if="activeTab === 'right'">
          <tradingFunArea type="FUTURES" :symbol="symbol"></tradingFunArea>
        </div>
      </div>
    </div>
    <div class="bottom bg-white mt-5 px-10">
      <van-tabs
        v-model:active="active"
        offset-top="74"
        background="var(--color-background-1)"
        title-active-color="var(--color-tab-text)"
        title-inactive-color="#B0B0B0"
        @click-tab="onClickTab"
        ref="tabsRefs"
        shrink
        sticky
      >
        <van-tab v-if="activeTab === 'left'" :title="$t('contract.orderBook')">
          <realTimeTransactions ref="realTimeTransactionsRef" type="FUTURES"></realTimeTransactions>
        </van-tab>
        <van-tab v-if="activeTab === 'left'" :title="$t('contract.transactions')">
          <transactionOrder  ref="transactionOrderRef" type="FUTURES"></transactionOrder>
        </van-tab>
        <van-tab v-if="activeTab === 'right'" :title="$t('contract.order')">
          <positionOrder accountType="FUTURES"></positionOrder>
        </van-tab>
        <div v-if="activeTab === 'right'" class="orderIconBox pos-absolute" @click="goOrder">
          <image
            src="/static/images/checkBit.png"
            mode="scaleToFill"
          />
        </div>
      </van-tabs>
    </div>
    <div v-if="activeTab === 'left'" class="btnBox pos-fixed w-100 flex">
      <van-button class="buyBtn flex-1" type="success" @click="switchTab('right')">{{$t('noun.doMore')}}</van-button>
      <van-button class="sellBtn flex-1" type="danger" @click="switchTab('right')">{{$t('noun.doLess')}}</van-button>
    </div>
    <CustomNavBar></CustomNavBar>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed,onMounted,nextTick,onUnmounted ,watch} from 'vue';
import { onHide, onLoad } from "@dcloudio/uni-app";
import CustomNavBar from '@/components/customNavBar/index.vue';
import trendChart from '@/components/trendChart/index.vue';
import realTimeTransactions from '@/components/business/realTimeTransactions/index.vue'
import transactionOrder from '@/components/business/transactionOrder/index.vue'
import positionOrder from '@/components/business/positionOrder/index.vue'
import tradingFunArea from '@/components/business/tradingFunArea/index.vue'
import { useControlStore } from '@/stores/control';

import { useUserStore } from '@/stores/user';
const controlStore = useControlStore();
const userStore = useUserStore();
const socketService = computed(() => userStore.socketService);


const active = ref(0)
const activeTab = ref<'left' | 'right'>('left');
const switchTab = (tab: 'left' | 'right') => {
  activeTab.value = tab;
};
const realTimeTransactionsRef: any = ref(null)
const transactionOrderRef: any = ref(null)
const symbol = ref('BTC/USDT') //默认交易对

const tabsRefs: any = ref(null);

const statusBarHeight = ref('0px')

watch(
  () => controlStore.getQuotesData('FUTURES')?.symbol,
  (newVal, oldVal) => {
	if(newVal){
		loadInfo(newVal); //订阅新的交易对
		symbol.value = newVal
	}
  }
)

onMounted(() => {
  // #ifdef APP-PLUS
  uni.getSystemInfo({
    success: (res) => {
      // 设置状态栏高度
      statusBarHeight.value = res.statusBarHeight + 'px'
    }
  })
  // #endif
})

onLoad(() => {
  uni.hideTabBar()
	if(controlStore.getQuotesData('FUTURES')?.symbol){
		  symbol.value= controlStore.getQuotesData('FUTURES')?.symbol
	}else{
		  controlStore.setQuotesData('FUTURES',{
			  symbol:symbol.value,
			  activeType:'right'
		  })
	}
	loadInfo(symbol.value)
  // 修正类型错误，确保赋值为 'left' 或 'right'
  activeTab.value = controlStore.getQuotesData('FUTURES')?.activeType || 'left';
})

const loadInfo =(symbol:string)=>{
	nextTick(()=>{
		setTimeout(()=>{
			realTimeTransactionsRef.value?.loadData({  //调用深度行情，只有在K线图页面才处理
			  klineType: 'FUTURES',
			  symbol: symbol
			})
		},100)
	})
}

//调换订单历史
const goOrder = () => {
  uni.navigateTo({
    url: '/pages/transactionOrder/index?type=FUTURES'
  })
}

onUnmounted(() => {
	socketService.value.unsubscribe('ticker',symbol.value);
	socketService.value.unsubscribe('depth',symbol.value);
	socketService.value.unsubscribe('kline',symbol.value);
	socketService.value.unsubscribe('ticker');
})

const onClickTab = (e: any) => {
  nextTick(() => {
    let currentRef : any
    switch(active.value) {
      case 0:
        currentRef = realTimeTransactionsRef
        break
      case 1:
        currentRef = transactionOrderRef
        break
		default:
    }
    console.log('contract currentRef', currentRef.value)
    tabsRefs.value.resize()
    currentRef.value?.loadData({klineType: 'FUTURES', symbol: symbol.value});
  })
}

const sliderStyle = computed(() => ({
  transform: `translateX(${activeTab.value === 'left' ? '0' : '100%'})`,
  // width: '50%' // 与switch-item宽度匹配
}))

</script>

<style lang="scss">
/* App 端特定样式 */
// #ifdef APP-PLUS
:deep(.van-tabs) {
  /* 修复底部指示器样式 */
  .van-tabs__line {
    display: none!important;
  }
  /* 确保激活状态的标签颜色正确 */
  .van-tab--active {
    font-weight: bold;
    color: #333333 !important;
  }
}
// #endif
.contract-index {
  background: var(--color-background-box);
  height: 100vh;
  .top {
    padding: 20rpx;
    .switch-container-box {
      left: 0;
      // #ifdef H5
      top: 0;
      // #endif
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
          background: var(--color-background-box);
          color: #B0B0B0;
          &.active {
            color: #FFFFFF;
            background-color: var(--color-light-primary);
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
    .tabBox {
      margin-top: 50px;
    }
  }
  
  .bottom {
    .orderIconBox {
      top: 20rpx;
      right: 20px;
      image {
        width: 10px;
        height: 10px;
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
    background: var(--color-background);
    z-index: 99;
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
      border-bottom: 2px solid var(--color-background-box) !important;
    }
  }
}
</style>