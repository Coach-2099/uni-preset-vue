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
          <div>{{ symbolInfo }}</div>
        </div>
        <div class="increaseAndDecreaseBox">
          <text class="text-red fs-12">-3.37%</text>
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
        <buyAndSellContract v-if="buyAndSellType == 'contract'"></buyAndSellContract>
      </div>
      <div class="flex-1">
        <priceFluctuations></priceFluctuations>
      </div>
    </div>

    <floatingPanelProps ref="floatingPanelPropsRef"></floatingPanelProps>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import buyAndSell from '@/components/business/buyAndSell/index.vue';
import priceFluctuations from '@/components/business/priceFluctuations/index.vue';
import buyAndSellContract from '@/components/business/buyAndSellContract/index.vue';
import floatingPanelProps from '@/components/business/floatingPanelSpot/index.vue'
import { useControlStore } from '@/stores/control';

import { getSymbolInfo } from '@/api/trade'
import { onShow } from '@dcloudio/uni-app';

// stores
const controlStore = useControlStore();

// 默认BTC/USDT
const symbolInfo = ref('BTC/USDT')
const showFLoatingPanel = ref(false)
const floatingPanelPropsRef: any = ref(null)
const showChart = ref(false)

const props = defineProps({
  buyAndSellType: {
    type: String,
    default: 'SPOT'
  }
})

onShow(() => {
  console.log('onshow')
  symbolInfo.value = 'BTC/USDT'
  if (controlStore.quotesData.symbol) symbolInfo.value = controlStore.quotesData.symbol
})

onMounted(() => {
  console.log('onMounted')
  console.log('buyAndSellType: ', props.buyAndSellType)
  // 进入页面请求获取配置的接口
  // 默认BTC/USDT
  getBuyAndSellConfig()
})

const getBuyAndSellConfig = async () => {
  const params = {
    symbol: 'BTC/USDT'
  }
  const data = await getSymbolInfo(params)
  console.log('配置  data: ', data)
}

const checkBit = () => {
  console.log('触发')
  floatingPanelPropsRef.value?.showFLoatingPanel()
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
  }
  .marginTop75 {
    margin-top: 75px;
  }
}
</style>