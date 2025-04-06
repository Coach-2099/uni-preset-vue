<template>
  <div class="trade-index pos-relative">
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
      <div class="tabBox">
        <div v-if="activeTab === 'left'">
          <trendChart type="SPOT"></trendChart>
        </div>
        <div v-if="activeTab === 'right'">
          <tradingFunArea type="SPOT" :symbol="symbol"></tradingFunArea>
        </div>
      </div>
    </div>
    <div class="bottom pos-relative bg-white mt-5 px-10">
      <van-tabs v-model:active="active" offset-top="74" @click-tab="onClickTab" shrink sticky>
        <van-tab v-if="activeTab === 'left'" title="订单表">
          <realTimeTransactions ref="realTimeTransactionsRef" type="SPOT"></realTimeTransactions>
        </van-tab>
        <van-tab v-if="activeTab === 'left'" title="成交">
          <transactionOrder ref="transactionOrderRef" type="SPOT"></transactionOrder>
        </van-tab>
       <van-tab v-if="activeTab === 'right'" title="订单">
          <tradeOrder ref="tradeOrderRef"></tradeOrder>
        </van-tab>
      </van-tabs>
      <div v-if="activeTab === 'right'" class="orderIconBox pos-absolute" @click="goOrder">
        <image
          src="/static/images/checkBit.png"
          mode="scaleToFill"
        />
      </div>
    </div>
    <div v-if="activeTab === 'left'" class="btnBox pos-fixed w-100 flex">
      <van-button class="buyBtn flex-1" type="success">Buy</van-button>
      <van-button class="sellBtn flex-1" type="danger">Sell</van-button>
    </div>
    <CustomNavBar></CustomNavBar>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed, nextTick ,watch} from 'vue'
import { onHide, onLaunch, onLoad, onShow } from "@dcloudio/uni-app";
import CustomNavBar from '@/components/customNavBar/index.vue';
import trendChart from '@/components/trendChart/index.vue';
import realTimeTransactions from '@/components/business/realTimeTransactions/index.vue'
import transactionOrder from '@/components/business/transactionOrder/index.vue'
import tradeOrder from '@/components/business/tradeOrder/index.vue'
import tradingFunArea from '@/components/business/tradingFunArea/index.vue'
import { useControlStore } from '@/stores/control';

// stores
const controlStore = useControlStore();

const active = ref(0)

const activeTab = ref<'left' | 'right'>('left')

const realTimeTransactionsRef: any = ref(null)
const transactionOrderRef: any = ref(null)
const tradeOrderRef: any = ref(null)

const symbol = ref('BTC/USDT')

watch(
  () => controlStore.getQuotesData('SPOT')?.symbol,
  (newVal, oldVal) => {
	if(newVal){
		loadInfo(newVal); //订阅新的交易对
		symbol.value = newVal
	}
  }
)

onLoad(() => {
  if(controlStore.getQuotesData('SPOT')?.symbol){
  	  symbol.value= controlStore.getQuotesData('SPOT')?.symbol
  }else{
  	  controlStore.setQuotesData('SPOT',{
  		  symbol:symbol.value,
  		  activeType:'right'
  	  })
  }
	loadInfo(symbol.value)
  // 修正类型错误，确保赋值为 'left' 或 'right'
  activeTab.value = controlStore.getQuotesData('SPOT')?.activeType || 'left';
})

const loadInfo =(symbol:string)=>{
	nextTick(()=>{
		setTimeout(()=>{
			realTimeTransactionsRef.value?.loadData({  //调用深度行情，只有在K线图页面才处理
			  klineType: 'SPOT',
			  symbol: symbol
			})
		},100)
	})
}


onLaunch(() => {
  uni.hideTabBar();
})

const switchTab = (tab: 'left' | 'right') => {
  activeTab.value = tab
}

const sliderStyle = computed(() => ({
  transform: `translateX(${activeTab.value === 'left' ? '0' : '100%'})`,
  width: '50%' // 与switch-item宽度匹配
}))

const goOrder = () => {
  uni.navigateTo({
    url: '/pages/transactionOrder/index'
  })
}

const onClickTab = (e: any) => {
  console.log('点击了标签页', e);
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
    console.log('currentRef', currentRef.value)
    currentRef.value?.loadData({klineType: 'SPOT', symbol: symbol.value});
  })
}

</script>

<style lang="scss" scoped>
.trade-index {
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