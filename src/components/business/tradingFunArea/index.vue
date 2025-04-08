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
      <!-- <div class="toolsBtn" @click="showChartBtn">
        <image
          src="/static/images/tools.png"
          mode="scaleToFill"
        />
      </div> -->
    </div>
    <div v-if="showChart" class="lineChartBox mt-25">
    </div>
    <div
      class="mt-15 buyAndSellBox flex justify-between items-stretch"
      :class="{'marginTop75': !showChart}"
    >
      <div class="buyAndSellMoudle flex-1">
        <buyAndSell v-if="type == 'SPOT'" ref="buySellRef" :lastPrice="lastPrice" :symbol="symbol"></buyAndSell>
        <buyAndSellContract v-if="type == 'FUTURES'|| type == 'METALS'" ref="buyAndSellContractRef" :type="type" :lastPrice="lastPrice" :symbol="symbol"></buyAndSellContract>
      </div>
      <!-- <div class="flex-1"> -->
      <div class="rightDev">
        <priceFluctuations :lastPrice="lastPrice" ref="priceFluctuationsRef" :type="type"></priceFluctuations>
      </div>
    </div>

    <floatingPanelProps ref="floatingPanelPropsRef"></floatingPanelProps>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted ,computed,onUnmounted,nextTick,watch} from 'vue';
import buyAndSell from '@/components/business/buyAndSell/index.vue';
import priceFluctuations from '@/components/business/priceFluctuations/index.vue';
import buyAndSellContract from '@/components/business/buyAndSellContract/index.vue';
import floatingPanelProps from '@/components/business/floatingPanelSpot/index.vue'
import { useControlStore } from '@/stores/control';

import { useUserStore } from '@/stores/user';
import { getTicker } from '@/api/quotes';
import { onLoad, onShow } from '@dcloudio/uni-app';

// stores
const controlStore = useControlStore();
const userStore = useUserStore();
const socketService = computed(() => userStore.socketService);

// 默认BTC/USDT
// const symbol = ref('BTC/USDT') //默认交易对
const showFLoatingPanel = ref(false) //是否加载行情列表
const floatingPanelPropsRef: any = ref(null) //行情列表引用
const priceFluctuationsRef: any = ref(null) //深度引用
const buySellRef: any = ref(null) //买卖引用
const buyAndSellContractRef:any =ref(null) //合约买卖引用
const showChart = ref(false)
const lastPrice = ref(0) //实时最新价
const rose = ref(0) //实时最新涨跌幅比例


const props = defineProps({
  type: {
    type: String,
    default: 'SPOT'
  },
  symbol:{
	  type:String,
	  default:'BTC/USDT'
  }
})


const loadInfo=(symbol:string)=>{
	nextTick(() => {
		socketService.value.subscribe('ticker',symbol);
		socketService.value.on(`${symbol}-ticker`, (data: any) => {
			lastPrice.value = data.close
			rose.value = Number((data.close-data.open)/data.open*100).toFixed(2)
		})
		priceFluctuationsRef.value?.loadData({
		  klineType: props.type,
		  symbol: symbol
		})
		if(props.type==='SPOT'){
			buySellRef.value?.loadData({
			  symbol: symbol
			})
		}else{
			buyAndSellContractRef.value?.loadData({
			  symbol: symbol
			})
		}
		if(lastPrice.value === 0){
			getLastPrice(symbol)
		}
	})
}

watch(
  () => controlStore.getQuotesData(props.type)?.symbol,
  (newVal, oldVal) => {
	if(newVal){
		socketService.value.unsubscribe('ticker',oldVal);
		socketService.value.unsubscribe('depth',oldVal); //取消原有订阅
		loadInfo(newVal); //订阅新的交易对
	}
  }
);

onShow(() => {
		loadInfo(props.symbol)
})
	
const getLastPrice=async(symbol:string)=>{
	const params ={
		klineType: props.type,
		symbol: symbol
	}
	const data = await getTicker(params)
	lastPrice.value = data.close
}

//默认切换显示的行情类型
const checkBit = () => {
  floatingPanelPropsRef.value?.showFLoatingPanel({type: props.type})
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