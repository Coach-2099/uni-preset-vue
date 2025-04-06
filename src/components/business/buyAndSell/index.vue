<template>
  <div class="buyAndSellMoudle-index flex-1">
    <div class="btnBox flex">
      <transition name="fade">
        <div @click="checkTemp('buy')" class="flex-1 text-center fw-b" :class="{ 'checkBuyBtn text-white': checkActive == 'buy' }">Buy</div>
      </transition>
      <transition name="fade">
        <div @click="checkTemp('sell')" class="flex-1 text-center fw-b" :class="{ 'checkSellBtn text-white': checkActive == 'sell' }">Sell</div>
      </transition>
    </div>
    <div class="mt-10 flex justify-between align-center">
      <div class="">
        <text class="fs-12 text-gray">{{ $t('module.buyAndSellModule.available') }}</text>
      </div>
      <div>
        <text class="mr-5 fs-12 text-black">{{checkActive==='buy'?basicCoinBalance:tradeCoinBalance}}</text>
        <text class="fs-12 text-black">{{checkActive==='buy'?basicToken:tradeToken}}</text>
      </div>
    </div>
    <div class="inputBox">
      <div class="baseSelect w-100 mt-10 pl-15 pr-10 py-5 flex justify-between items-center">
        <van-popover
          placement="bottom-end"
          v-model:show="showPopoverOrderType"
          :actions="actionsOrderType"
          @select="onSelectOrderType"
        >
          <template #reference>
            <div class="baseSelect w-100 py-5 flex justify-between items-center">
              <div class="leftBox flex items-center">
                <p class="fs-14 text-black">{{ orderTypeObj?.text }}</p>
              </div>
              <div class="rightBox flex items-center">
                <image
                  class="downIcon"
                  src="/static/images/down.png"
                  mode="scaleToFill"
                />
              </div>
            </div>
          </template>
        </van-popover>
      </div>
      <div v-if="orderTypeObj?.value === 'LIMIT'" class="baseInput-Special w-100 mt-10 pl-15 py-10 flex justify-between items-center">
        <div>
          <div
            @click="clickPriceInpupt"
            :class="showPriceInput ? 'fs-12 h-20' : 'fs-14'"
            class="text-gray price-label">{{ $t('noun.price') }}</div>
          <input
            v-if="showPriceInput"
            :focus="showPriceInput"
            v-model="price"
			@input="calculateMargin(tradeNum)"
            class="myInput flex-1 w-100"
            :placeholder="$t('tips.enterPrice')"
            placeholder-class="input-placeholder"
          />
        </div>
        <text class="fs-14 px-10 text-gray">USDT</text>
      </div>
      <div v-if="orderTypeObj?.value === 'LIMIT'" class="ml-5">
        <text class="fs-12 text-black">≈ {{price}}  USD</text>
      </div>
      <div class="baseInput-Special w-100 mt-10 pl-15 py-10 flex justify-between items-center">
        <div>
          <div
            @click="clickPriceInpupt"
            :class="showPriceInput ? 'fs-12 h-20' : 'fs-14'"
            class="text-gray price-label">{{ $t('noun.quantity') }}</div>
          <input
            v-if="showPriceInput"
            :focus="showPriceInput"
            v-model="tradeNum"
			@input="calculateMargin(tradeNum)"
            class="myInput flex-1 w-100"
            :placeholder="$t('tips.enterQuantity')"
            placeholder-class="input-placeholder"
          />
        </div>
        <text class="fs-14 px-10 text-gray">{{tradeToken}}</text>
      </div>
      <div class="baseSlider mt-15 px-5">
        <van-slider class="mySlider" bar-height="5" v-model="value" :step="5" @update:model-value="sliderChange">
          <template #button>
            <div class="custom-button">
              <image
                src="/static/images/checkSlider.png"
                mode="scaleToFill"
              />
            </div>
          </template>
        </van-slider>
        <div class="custom-progress-points" style="pointer-events: none;">
          <image
            :src="value >= 0 ? '/static/images/onSlider.png' : '/static/images/unSlider.png'"
            mode="scaleToFill"
          />
          <image
            :src="value >= 25 ? '/static/images/onSlider.png' : '/static/images/unSlider.png'"
            mode="scaleToFill"
          />
          <image
            :src="value >= 50 ? '/static/images/onSlider.png' : '/static/images/unSlider.png'"
            mode="scaleToFill"
          />
          <image
            :src="value >= 75 ? '/static/images/onSlider.png' : '/static/images/unSlider.png'"
            mode="scaleToFill"
          />
          <image
            :src="value >= 100 ? '/static/images/onSlider.png' : '/static/images/unSlider.png'"
            mode="scaleToFill"
          />
        </div>
      </div>
      <div class="baseInput-Special w-100 mt-15 pl-15 py-10 flex justify-between items-center">
        <div>
          <div
            @click="clickPriceInpupt"
            :class="showPriceInput ? 'fs-12 h-20' : 'fs-14'"
            class="text-gray price-label">{{ $t('noun.orderAmount') }}</div>
          <input
            v-if="showPriceInput"
            :focus="showPriceInput"
			disabled="true"
            v-model="tradeVal"
            class="myInput flex-1 w-100"
            :placeholder="$t('tips.enterOrderAmount')"
            placeholder-class="input-placeholder"
          />
        </div>
        <text class="fs-14 px-10 text-gray">{{basicToken}}</text>
      </div>
      <!-- <div class="baseText w-100 mt-10 pl-15 pr-10 py-5 flex justify-between items-center">
        <div class="leftBox flex items-center">
          <p class="fs-12 text-black">{{ $t('noun.buyUpTo') }}</p>
        </div>
        <div class="rightBox flex items-center">
          <text class="fs-12 text-light-gray">2.22304</text>
          <text class="fs-12 text-gray ml-5">BTC</text>
        </div>
      </div> -->
      <div class="myBtnBox mt-15">
        <van-button
          v-if="checkActive == 'buy'"
          class="myBuyBtn fw-b fs-14 w-100"
          type="success"
		   @click="submitTrade()"
        >Buy</van-button>
        <van-button
          v-if="checkActive == 'sell'"
          class="mySellBtn fw-b fs-14 w-100"
          type="danger"
		   @click="submitTrade()"
        >Sell</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref ,watch} from 'vue';
import { getSpotBalance } from '@/api/asset'
import { roundDown } from '@/utils/util';
import { getSymbolInfo, spotTrade } from '@/api/trade';
import { useControlStore } from '@/stores/control';
import { onShow } from '@dcloudio/uni-app';

const controlStore = useControlStore();
const props = defineProps({
  symbol: {
    type: String,
    default: 'BTC/USDT'
  },
  lastPrice:{ //最新价
	  type:Number,
	  default: 0
  }
})

watch(
  () => controlStore.canceled,
  (newVal, oldVal) => {
	loadSpotBalance()
  }
);

const showPopoverOrderType = ref(false) //显示交易方式变量
const actionsOrderType = [
  { text: '市价单', value: 'MARKET' },
  { text: '限价单', value: 'LIMIT' }
]
// 类型定义
type OrderType = {
  text: string;  // 订单类型名称：'限价单' | '市价单'
  value: string; // 订单类型值：LIMIT | MARKET
}
const orderTypeObj = ref<OrderType>({
  text: '市价单',
  value: 'MARKET'
})
const tradeCoinBalance = ref(0) //可用交易币余额
const basicCoinBalance = ref(0) //可用基础币余额
const checkActive = ref('buy');
const price = ref('');
const showPriceInput = ref(false)
const value = ref(0); //滑动值
const tradeNum = ref(0); //交易量
const tradeVal = ref(0) //交易价值USDT
const tradeToken = ref('') //交易币种
const basicToken = ref('') //基础币种
const direction = ref('') //做多/做空 
const tradeSymbol = ref({}) //交易对参数
const checkTemp = (type: string) => {
  checkActive.value = type;
}

//市价 限价选择
const onSelectOrderType = (action: any) => {
  orderTypeObj.value = action
}
//滑动获取交易量
const sliderChange =(val:number) =>{
	showPriceInput.value = true
	let currentBalance= 0
	if(checkActive.value === 'buy'){
		currentBalance = basicCoinBalance.value
	}else{
		currentBalance = tradeCoinBalance.value
	}
	if(orderTypeObj.value.value ==='MARKET'){
		if(currentBalance>0){
			tradeNum.value = roundDown(val/100 * currentBalance/props.lastPrice,tradeSymbol.value.minTradeDigit)
			tradeVal.value = roundDown(tradeNum.value * props.lastPrice,2)
		}
	}else{
		if(!price.value){
			return uni.showToast({title: '请输入正确的交易价格', icon: 'none'})
		}else{
			if(currentBalance>0){
				tradeNum.value = roundDown(val/100 * currentBalance/price.value,tradeSymbol.value.minTradeDigit)
				tradeVal.value = roundDown(tradeNum.value * price.value,2)
			}
		}
	}
}
const calculateMargin = (val: number) =>{
	showPriceInput.value = true
	let currentPrice = 0
	if(orderTypeObj.value.value ==='MARKET'){
		currentPrice = props.lastPrice
	}else if(!price.value){
	   return uni.showToast({title: '请输入正确的交易价格', icon: 'none'})
	}else{
		currentPrice = price.value
	}
	let maxVal = 0
	if(checkActive.value === 'buy'){
		maxVal =roundDown(basicCoinBalance.value / currentPrice,tradeSymbol.value.minTradeDigit)
	}else{
		maxVal = tradeCoinBalance.value
	}
	if(val>maxVal){
		return uni.showToast({title: '您输入的交易量大于最大可交易数量', icon: 'none'})
	}else{
		tradeVal.value = roundDown(val * currentPrice,2)
	}
}
//获取用户当前交易对币种可用余额
const loadSpotBalance = async () => {
	const params = {
	  symbol: props.symbol
	}
  const data = await getSpotBalance(params)
  tradeCoinBalance.value = data.tradeTokenBalance //获取余额数据
  basicCoinBalance.value = data.basicTokenBalance //获取余额数据
}

onMounted(()=>{
	getBuyAndSellConfig()
	const tradeSymbol = props.symbol.split('/')
	tradeToken.value = tradeSymbol[0]
	basicToken.value = tradeSymbol[1]
	showPriceInput.value  =true
	price.value = props.lastPrice //初始化当前价格
})

onShow(()=>{
	loadSpotBalance() 
})

//获取交易对配置信息
const getBuyAndSellConfig = async () => {
  const params = {
    symbol: props.symbol
  }
  const data = await getSymbolInfo(params)
  tradeSymbol.value = data
}

const clickPriceInpupt = () => {
  showPriceInput.value = !showPriceInput.value
}

//下单
const submitTrade = async () => {
	if(orderTypeObj.value.value ==='LIMIT' && !price.value){
		return uni.showToast({title: '请输入正确的交易价格', icon: 'none'})
	}else if(!tradeNum.value){
		return uni.showToast({title: '请输入正确的交易数量', icon: 'none'})
	}
	const params = {
	  symbol: props.symbol,
	  tradeAmount: tradeNum.value,
	  tradePrice: price.value,
	  tradeType: orderTypeObj.value.value,
	  direction: checkActive.value.toLocaleUpperCase(),
	}
	const data = await spotTrade(params) //合约下单
	if(!data || !data.errMsg){
		uni.showToast({title: '下单成功', icon: 'success'})
	}
	loadSpotBalance() //下单成功重新读取可用余额
	clearParams()
}

//清空交易参数
const clearParams= ()=>{
	tradeNum.value = 0 
	value.value =0
	tradeVal.value = 0 
}

</script>

<style lang="scss" scoped>
.buyAndSellMoudle-index {
  .btnBox {
    background: #F6F7FB;
    border-radius: 6px 6px 6px 6px;
    height: 28px;
    line-height: 28px;
    .checkBuyBtn {
      background: #0FB668;
      border-radius: 6px 6px 6px 6px;
    }
    .checkSellBtn {
      background: #FF3E47;
      border-radius: 6px 6px 6px 6px;
    }
    // 添加过渡动画
    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.3s ease;
    }
    .fade-enter,
    .fade-leave-to {
      opacity: 0;
    }
  }
  .inputBox {
    .baseSelect {
      background: #F6F7FB;
      border-radius: 8px 8px 8px 8px;
      height: 28px;
      .leftBox {
        .baseImg {
          width: 18px;
          height: 18px;
        }
      }
      .rightBox {
        .downIcon {
          width: 9px;
          height: 7px;
        }
      }
    }
    .baseInput-Special {
      background: #F6F7FB;
      border-radius: 8px 8px 8px 8px;
      height: 48px;
      .price-label {
        transition: font-size 0.2s ease; // 添加过渡效果
      }
    }
    .baseSlider {
      position: relative;
      .mySlider {
        position: relative;
        .custom-button {
          z-index:9;
          image {
            width: 14px;
            height: 14px;
          }
        }
      }
      .custom-progress-points {
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        transform: translateY(-60%);
        display: flex;
        justify-content: space-between;
        padding: 0 -1px; // 根据实际情况调整
        image {
          width: 14px;
          height: 14px;
        }
      }
    }
    .baseText {
      background: #F6F7FB;
      border-radius: 8px 8px 8px 8px;
      height: 28px;
    }
    .myBtnBox {
      .myBuyBtn {
        height: 32px;
        background: #0FB668;
        border-radius: 6px 6px 6px 6px;
      }
      .mySellBtn {
        height: 32px;
        background: #FF3E47;
        border-radius: 6px 6px 6px 6px;
      }
    }
  }
}
</style>