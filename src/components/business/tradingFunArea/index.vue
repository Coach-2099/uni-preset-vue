<template>
  <div class="transactionModule-index pos-relative">
    <div class="checkBitBox pos-fixed bg-white px-20 flex justify-between items-center">
      <div class="flex">
        <div class="flex checckBitBtn mr-5" @click="checkBit">
          <div class="checckBitImgBox mr-5">
            <image
              src="/static/images/checkBit.png"
              mode="scaleToFill"
            />
          </div>
          <div>{{ symbol }}</div>
        </div>
        <div class="increaseAndDecreaseBox px-5">
          <text class="text-red fs-12">{{rose}}%</text>
        </div>
      </div>
      <div class="toolsBtn" @click="showChartBtn">
        <image
          src="/static/images/tools.png"
          mode="scaleToFill"
        />
      </div>
    </div>
    <div v-if="showChart" class="lineChartBox mt-25">
      折线图1
    </div>
    <div class="mt-15 buyAndSellBox flex justify-between items-stretch" :class="{'marginTop75': !showChart}">
      <div class="buyAndSellMoudle flex-1">
        <buyAndSell v-if="buyAndSellType == 'spot'"></buyAndSell>
        <buyAndSellContract v-if="buyAndSellType == 'contract'" :lastPrice="lastPrice" :symbol="symbol"></buyAndSellContract>
      </div>
      <!-- <div class="flex-1"> -->
      <div class="rightDev">
        <priceFluctuations :lastPrice="lastPrice" ref="priceFluctuationsRef"></priceFluctuations>
      </div>
    </div> 

    <floatingPanelProps ref="floatingPanelPropsRef"></floatingPanelProps>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted ,computed,onUnmounted,nextTick} from 'vue';
import buyAndSell from '@/components/business/buyAndSell/index.vue';
import priceFluctuations from '@/components/business/priceFluctuations/index.vue';
import buyAndSellContract from '@/components/business/buyAndSellContract/index.vue';
import floatingPanelProps from '@/components/business/floatingPanelSpot/index.vue'
import { useControlStore } from '@/stores/control';

import { useUserStore } from '@/stores/user';

// stores
const controlStore = useControlStore();
const userStore = useUserStore();
const socketService = computed(() => userStore.socketService);

// 默认BTC/USDT
const symbol = ref('BTC/USDT') //默认交易对
const showFLoatingPanel = ref(false) //是否加载行情列表
const floatingPanelPropsRef: any = ref(null) //行情列表引用
const priceFluctuationsRef: any = ref(null) //深度引用
const showChart = ref(false)
const lastPrice = ref(0) //实时最新价
const rose = ref(0) //实时最新涨跌幅比例


const props = defineProps({
  buyAndSellType: {
    type: String,
    default: 'SPOT'
  }
})

onMounted(() => {
  nextTick(() => {
	  console.log('load here')
	  if (controlStore.quotesData.symbol){
      symbol.value = controlStore.quotesData.symbol
	  }
	  socketService.value.subscribe('ticker',symbol.value);
	  socketService.value.on(`${symbol.value}-ticker`, (data: any) => {
      lastPrice.value = data.close
			rose.value = Number((data.close-data.open)/data.open*100).toFixed(2)
	  })
	  priceFluctuationsRef.value?.loadData({
	    klineType: 'FUTURES',
	    symbol: symbol.value
	  })
  })
})


const checkBit = () => {
  floatingPanelPropsRef.value?.showFLoatingPanel({type: 'FUTURE'})
}

const showChartBtn = () => {
  showChart.value = !showChart.value
}

</script>

<style lang="scss" scoped>
.transactionModule-index {
  .checkBitBox {
    left: 0;
    right: 0;
    top: 50px;
    z-index: 29;
    .checckBitBtn {
      .checckBitImgBox {
        image {
          width: 14px;
          height: 14px;
        }
      }
    }
    .toolsBtn {
      image {
        width: 13px;
        height: 16px;
      }
    }
  }
  .lineChartBox {
    margin-top: 75px;
  }
  .increaseAndDecreaseBox {
    background: #FFD3D9;
    border-radius: 3px 3px 3px 3px;
  }
  .buyAndSellBox {
    gap: 14px;
    .buyAndSellMoudle {
    }
    .rightDev {
      width: 40%;
    }
  }
  .marginTop75 {
    margin-top: 75px;
  }
}
</style>