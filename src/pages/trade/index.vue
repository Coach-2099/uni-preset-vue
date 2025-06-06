<template>
  <div class="trade-index">
    <van-config-provider :theme="themeVal">
      <div class="top bg-white pos-relative">
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
            <trendChart type="SPOT"></trendChart>
          </div>
          <div v-if="activeTab === 'right'">
            <tradingFunArea type="SPOT" :symbol="symbol"></tradingFunArea>
          </div>
        </div>
      </div>
      <div class="bottom pos-relative bg-white mt-5 px-10">
        <van-tabs
          v-model:active="active"
          offset-top="74"
          @click-tab="onClickTab"
          background="var(--color-background-1)"
          title-active-color="var(--color-tab-text)"
          title-inactive-color="#B0B0B0"
          shrink
          sticky
        >
          <van-tab v-if="activeTab === 'left'" :title="$t('contract.orderBook')">
            <realTimeTransactions ref="realTimeTransactionsRef" type="SPOT"></realTimeTransactions>
          </van-tab>
          <van-tab v-if="activeTab === 'left'" :title="$t('contract.transactions')">
            <transactionOrder ref="transactionOrderRef" type="SPOT"></transactionOrder>
          </van-tab>
          <van-tab v-if="activeTab === 'right'" :title="$t('contract.order')">
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
        <van-button class="buyBtn flex-1" type="success" @click="switchTab('right')">{{ $t('operation.buy') }}</van-button>
        <van-button class="sellBtn flex-1" type="danger" @click="switchTab('right')">{{ $t('operation.sell') }}</van-button>
      </div>
    </van-config-provider>
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
const themeVal = uni.getStorageSync('APP_THEME') || 'light'

const realTimeTransactionsRef: any = ref(null)
const transactionOrderRef: any = ref(null)
const tradeOrderRef: any = ref(null)

const symbol = ref('BTC/USDT')

// 添加状态栏高度变量
const statusBarHeight = ref('0px')

// 组件初始化状态
const initComponents = ref({
  left: true,
  right: false
})

watch(
  () => controlStore.getQuotesData('SPOT')?.symbol,
  (newVal, oldVal) => {
	if(newVal){
		loadInfo(newVal); //订阅新的交易对
		symbol.value = newVal
	}
  }
)

// 在组件首次挂载时，确保预先初始化当前激活的组件
onMounted(() => {
  // #ifdef APP-PLUS
  initComponents.value = {
    left: activeTab.value === 'left',
    right: activeTab.value === 'right'
  }

  // 获取系统信息
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
  uni.hideTabBar()
})

const switchTab = (tab: 'left' | 'right') => {
  activeTab.value = tab

  // #ifdef APP-PLUS
  // 确保组件已初始化
  initComponents.value[tab] = true
  // #endif

}

const sliderStyle = computed(() => ({
  transform: `translateX(${activeTab.value === 'left' ? '0' : '100%'})`,
  // width: '50%' // 与switch-item宽度匹配
}))

const goOrder = () => {
  uni.navigateTo({
    url: '/pages/transactionOrder/index?type=SPOT'
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
.trade-index {
  background: var(--color-background-2);
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
          background: var(--color-background-box);
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