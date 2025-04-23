<template>
  <div class="buyAndSellContract-index">
    <van-popover
      v-model:show="showPopover"
      placement="bottom-end"
      :actions="leverageData"
      @select="onSelect"
    >
      <template #reference>
        <div class="dropDownBox flex justify-between align-center w-100">
          <div class="fs-12 text-black">{{leverage?.text}}</div>
          <div class="imgBox">
            <image
              class="downIcon"
              src="/static/images/downGray.png"
            />
          </div>
        </div>
      </template>
    </van-popover>
    <div class="mt-10 flex justify-between align-center">
      <div class="">
        <text class="fs-12 text-gray">{{ $t('module.buyAndSellModule.available') }}</text>
      </div>
      <div>
        <text class="mr-5 fs-12 text-black">{{marginBalance.toFixed(2)}}</text>
        <text class="fs-12 text-black">USDT</text>
      </div>
    </div>
    <div class="inputBox">
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


      <div 
        v-if="orderTypeObj?.value === 'LIMIT'"
        class="baseInput-Special w-100 mt-10 pl-15 py-10 flex justify-between items-center"
      >
        <div>
          <div
            @click="clickPriceInpupt"
            :class="showPriceInput ? 'fs-12 h-20' : 'fs-14'"
            class="text-gray price-label"
          >
            <text>{{ $t('noun.price') }}</text>
          </div>
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
        <text class="fs-14 px-10 text-black">{{basicToken}}</text>
      </div>
	  <!-- 下单价格和数量 -->
      <div
        v-if="settingAfterConfirmation === '1'" 
        class="baseInput-Special w-100 mt-10 pl-15 py-10 flex justify-between items-center">
        <div>
          <div
            @click="clickPriceInpupt"
            :class="showPriceInput ? 'fs-12 h-20' : 'fs-14 topHideTemp'"
            class="text-gray price-label">
              <!-- <text>{{ $t('noun.quantity') }}</text> -->
              {{ $t('noun.quantity') }}
            </div>
          <input
            v-if="showPriceInput"
            :focus="showPriceInput"
			      @input="calculateMargin(tradeNum)"
            v-model="tradeNum"
            class="myInput flex-1 w-100"
            :placeholder="$t('tips.enterQuantity')"
            placeholder-class="input-placeholder"
          />
        </div>
        <div class="checkTypeBox flex jusify-between items-center px-10" @click="checkPriceAndQuantity">
          <text class="fs-14 text-black">{{tradeToken}}</text>
          <div class="imgBox ml-5">
            <image
              class="downIcon"
              src="/static/images/down.png"
              mode="scaleToFill"
            />
          </div>
        </div>
      </div>

      <div v-if="settingAfterConfirmation === '2'" class="baseInput-Special w-100 mt-10 pl-15 py-10 flex justify-between items-center">
        <div>
          <div
            @click="clickPriceInpupt"
            :class="showPriceInput ? 'fs-12' : 'fs-14'"
            class="text-gray price-label">
              <!-- <text>{{ $t('noun.orderValue') }}</text> -->
              {{ $t('noun.orderValue') }}
            </div>
          <input
            v-if="showPriceInput"
            :focus="showPriceInput"
            v-model="tradeNum"
            class="myInput flex-1 w-100"
            :placeholder="$t('tips.enterOrderValue')"
            placeholder-class="input-placeholder"
          />
        </div>
        <div
          class="checkTypeBox flex jusify-between items-center px-10"
          @click="checkPriceAndQuantity"
        >
          <text class="fs-14 text-black">{{basicToken}}</text>
          <div class="imgBox ml-5">
            <image
              class="downIcon"
              src="/static/images/down.png"
              mode="scaleToFill"
            />
          </div>
        </div>
      </div>
	    <!--滑动可交易量 -->
      <div class="baseSlider mt-15 px-15">
        <van-slider
          class="mySlider"
          bar-height="5"
          v-model="value"
          @update:model-value="sliderChange"
          :step="5"
        >
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
	  
	  <!-- 实际成本 -->
      <div class="baseBox mt-15 py-5 pl-15 pr-10">
        <div class="flex justify-between items-center fs-12 text-gray">
          <div v-if="settingAfterConfirmation === '1'">{{ $t('noun.quantity') }}</div>
          <div v-if="settingAfterConfirmation === '2'">{{ $t('noun.cost') }}</div>
          <div class="">
            <text class="text-light-green">{{tradeVal}}</text>
            <!--  /<text class="text-red">{{orderTypeObj?.value === 'MARKET'?lastPrice:price}}</text> -->
			{{basicToken}}
          </div>
        </div>
        <div class="flex justify-between mt-5 items-center fs-12 text-gray">
          <div>{{ $t('noun.cost') }}</div>
          <div class="">
            <text class="text-light-green">{{margin}}</text> 
            <!-- /<text class="text-red">{{orderTypeObj?.value === 'MARKET'?lastPrice:price}}</text> -->
            {{basicToken}}
          </div>
        </div>
      </div>
	  <!-- 止盈止损-->
      <div class="stopTemp mt-15">
        <van-checkbox v-model="checked" shape="square" @change="changeChecked">
          <template #icon="props">
            <div class="imgBox">
              <image 
                class="img-icon"
                :src="props.checked ? activeIcon : inactiveIcon"
              />
            </div>
          </template>
          <text
            class="fs-12"
            :class="checked ? 'text-black' : 'text-gray'"
          >{{ $t('noun.takeProfitAndStopLoss') }}</text>
        </van-checkbox>
        <div v-if="checked" class="baseInput pr-10 mt-10 flex justify-between items-center">
          <input
            v-model="stopProfitVal"
            class="myInput px-10 w-50"
            :placeholder="$t('noun.takeProfit')"
            placeholder-class="input-placeholder"
          />
        </div>
        <div v-if="checked" class="baseInput pr-10 mt-10 flex justify-between items-center">
          <input
            v-model="stopProfitVal"
            class="myInput px-10 w-50"
            :placeholder="$t('noun.stopLoss')"
            placeholder-class="input-placeholder"
          />
        </div>
      </div>
      <div class="myBtnBox mt-10">
        <van-button
          @click="buyOrSellFun('LONG')"
          class="myBuyBtn fw-b fs-14 w-100"
          type="success"
        >{{ $t('noun.doMore') }}</van-button>
        <div class="mt-5">
          <van-button
            @click="buyOrSellFun('SHORT')"
            class="mySellBtn fw-b fs-14 w-100"
            type="danger"
          >{{ $t('noun.doLess') }}</van-button>
        </div>
      </div>
    </div>
	<!--选择下单量的方式，以USDT or交易币 -->
    <van-popup
      v-model:show="showPreferences"
      position="bottom"
      round
      :style="{ height: '32%' }"
    >
      <div class="px-20">
        <p class="text-black fw-b fs-14 pt-20">{{ $t('contract.buyAndSellContract.popup.preferences') }}</p>
        <div class="mt-20">
          <van-radio-group v-model="checkedSettings">
            <van-radio name="1" icon-size="20px">
              <div>
                <div class="flex justify-between items-center fs-12 fw-b text-black">
                  <p>{{ $t('contract.buyAndSellContract.popup.byQuantity') }}</p>
                  <p>{{tradeToken}}</p>
                </div>
                <p class="fs-12 text-gray w-100">{{ $t('contract.buyAndSellContract.popup.byQuantityTip') }} {{tradeToken}}</p>
              </div>
            </van-radio>
            <van-radio name="2" icon-size="20px">
              <div class="mt-15">
                <div class="flex justify-between items-center fs-12 fw-b text-black">
                  <p>{{ $t('contract.buyAndSellContract.popup.byValue') }}</p>
                  <p>{{basicToken}}</p>
                </div>
                <p class="fs-12 text-gray w-100">{{ $t('contract.buyAndSellContract.popup.byValueTip') }}</p>
              </div>
            </van-radio>
          </van-radio-group>
        </div>
        <div class="popupBtnBox mt-25">
          <van-button
            @click="clickPreferences"
            class="myBtn w-100"
            type="primary"
          >
            {{ $t('common.confirm') }}
          </van-button>
        </div>
      </div>
    </van-popup>

    <!-- 做多 -->
    <van-popup
      v-model:show="showBuyPopup"
      position="bottom"
      round
      :style="{ height: '45%' }"
    >
      <div class="px-20 pos-relative">
        <p class="mt-20">{{ orderTypeObj.value ==='MARKET' ? $t('noun.marketOrder') : $t('noun.priceLimitOrder') }} {{ direction === 'LONG' ? $t('noun.doMore') : $t('noun.doLess') }} {{symbol}}</p>
        <div class="fs-12 text-gray mt-20">
          <div class="flex justify-between items-center">
            <div class="">{{ $t('contract.orderPrice') }}</div>
            <div :class="direction === 'LONG'?'text-light-green':'fs-16 text-red'">{{ orderTypeObj.value ==='MARKET' ? $t('noun.marketOrder') : $t('noun.priceLimitOrder') }}</div>
          </div>
          <div class="flex justify-between items-center mt-15">
            <div>{{ $t('contract.orderQuantity') }}</div>
            <div class="text-black">{{tradeNum}} {{tradeToken}}</div>
          </div>
          <div class="flex justify-between items-center mt-15">
            <div>{{ $t('contract.orderCost') }}</div>
            <div class="text-black">{{margin}}</div>
          </div>
          <div class="flex justify-between items-center mt-15">
            <div>{{ $t('contract.value') }}</div>
            <div class="text-black">{{tradeVal}} {{basicToken}}</div>
          </div>
          <div class="flex justify-between items-center mt-15">
            <div>{{ $t('contract.positionLeverage') }}</div>
            <div class="text-black">{{ $t('contract.fullPosition') }}{{leverage.text}}</div>
          </div>
		  <div v-if="stopProfitVal>0" class="flex justify-between items-center mt-15">
		    <div>{{ $t('contract.takeProfitPrice') }}</div>
		    <div class="text-black">{{stopProfitVal}}</div>
		  </div>
		  <div v-if="stopLossVal>0"  class="flex justify-between items-center mt-15">
		    <div>{{ $t('contract.stopLossPrice') }}</div>
		    <div class="text-black">{{stopLossVal}}</div>
		  </div>
        </div>
        <div class="popupBtnBoxBuy w-100 mt-20 pb-20">
          <div>
            <van-checkbox v-model="checkedNoPopupWindows" @change="noPopupWindows" shape="square">
              <template #icon="props">
                <image class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
              </template>
              <text
                class="fs-14"
                :class="checkedNoPopupWindows ? 'text-black' : 'text-gray'"
              >{{ $t('contract.noConfirmationPopup') }}</text>
            </van-checkbox>
          </div>
          <div class="mt-10">
            <van-button class="myBtn w-100" @click="submitTrade" :type="direction==='LONG'?'primary':'warning'">{{ $t('common.confirm') }}</van-button>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { getLeverages, futuresTrade, getSymbolInfo ,metalsTrade} from '@/api/trade'
import { getSwapBalance } from '@/api/asset'
import { storeToRefs } from 'pinia'
import { roundDown } from '@/utils/util'
// 图片
import square from '@/static/images/square.png'
import checkSquare from '@/static/images/checkSquare.png'
import searchIcon from '@/static/images/search.png'
import { useI18n } from 'vue-i18n';

import { useControlStore } from '@/stores/control'
import { onShow } from '@dcloudio/uni-app';
const controlStore = useControlStore();
const { t } = useI18n();

const props = defineProps({
  lastPrice:{ //最新价
	  type:Number,
	  default: 0
  },
  type:{
	  type:String,
	  default:'FUTURES'
  }
})

watch(
  () => controlStore.canceled,
  (newVal, oldVal) => {
	loadSwapBalance()
  }
);



const checkedSettings = ref('1') //价值切换 
const settingAfterConfirmation = ref('1') //价值切换值
const symbol = ref('') //
const price = ref(0); //交易价格
const tradeNum = ref(0); //交易量
const showPriceInput = ref(false) //是否显示价格输入
const value = ref(0); //滑动比例值
const stopProfitVal = ref(0); //止盈
const stopLossVal = ref(0); //止损

const checked = ref(false)
const searchValue = ref('')

const activeIcon = ref(checkSquare)
const inactiveIcon = ref(square)

const leverageData = ref<any[]>([]);
const leverage = ref({}) //当前杠杆倍数

const marginBalance = ref(0) //可用保证金余额
const tradeToken = ref('') //交易币种
const basicToken = ref('') //基础币种
const tradeVal = ref(0) //交易价值
const margin = ref(0) //下单预估保证金
const direction = ref('') //做多/做空 
const tradeSymbol = ref({}) //交易对参数

const showPopover = ref(false);

const showPopoverOrderType = ref(false)
const actionsOrderType = [
  { text: t('noun.marketOrder'), value: 'MARKET' },
  { text: t('noun.priceLimitOrder'), value: 'LIMIT' }
]

// 类型定义
type OrderType = {
  text: string;  // 订单类型名称：'限价单' | '市价单'
  value: string; // 订单类型值：LIMIT | MARKET
}
const orderTypeObj = ref<OrderType>({
  text: t('noun.marketOrder'),
  value: 'MARKET'
})

// 下单偏好设置
const showPreferences = ref(false)

// 展示做多数据弹窗
const showBuyPopup = ref(false)
// 展示做空数据弹窗
const showSellPopup = ref(false)

// 是否显示弹窗
const checkedNoPopupWindows = ref(false)

//选择杠杆
const onSelect = (action: any) => {
  leverage.value = action
  if(value.value>0){ //如果滑动值>0走滑动计算
	  sliderChange(value.value)
  }else{
	calculateMargin(tradeNum.value) //重新计算保证金
  }
}

//获取合约账户可用保证金
const loadSwapBalance = async () => {
	const params = {
	  accounType: props.type
	}
  const data = await getSwapBalance(params)
  marginBalance.value = data //获取余额数据
}

onMounted(() => {
	loadLeverages()
	// 进入页面请求获取配置的接口
})

onShow(()=>{
	loadSwapBalance()
})

const loadData =(params:any)=>{
	console.log('params = ',params)
	symbol.value = params.symbol
	// 进入页面请求获取配置的接口
	getBuyAndSellConfig()
	const tradeSymbol = symbol.value.split('/')
	tradeToken.value = tradeSymbol[0]
	basicToken.value = tradeSymbol[1]
	loadSwapBalance()
}

//获取交易对配置信息
const getBuyAndSellConfig = async () => {
  const params = {
    symbol: symbol.value
  }
  const data = await getSymbolInfo(params)
  tradeSymbol.value = data
}


//获取杠杆列表
const loadLeverages = async () => {
  const data = await getLeverages()
  data.forEach((item: any)=>{
	  leverageData.value.push({ text: item.name, value: item.value })
  })
  leverage.value = leverageData.value[0]
  
}

//市价 限价选择
const onSelectOrderType = (action: any) => {
  orderTypeObj.value = action
}

const sliderChange =(val:number) =>{
	let currentPrice = 0
	if(orderTypeObj.value.value ==='MARKET'){
		currentPrice = props.lastPrice
	}else{
		if(!price.value){
			return uni.showToast({title: t('trading.enterValidPrice'), icon: 'none'})
		}else{
			currentPrice = price.value
		}
	}
	console.log('tradeSymbol.value.minTradeDigit =',tradeSymbol.value.minTradeDigit)
	showPriceInput.value = true
	let marginVal = roundDown(val/100 * marginBalance.value/currentPrice ,tradeSymbol.value.minTradeDigit) || 0 //滑动比例×usdt余额/最新价
	tradeNum.value = roundDown(marginVal * leverage.value.value,tradeSymbol.value.minTradeDigit) || 0
	tradeVal.value = roundDown(tradeNum.value * currentPrice,tradeSymbol.value.showUnit) || 0
	console.log('tradeNum::', tradeNum.value)
  console.log('readeVal!!', tradeVal.value)
  if(val === 100){
		margin.value = roundDown(marginBalance.value,tradeSymbol.value.showUnit)
	}else{
		margin.value = roundDown(currentPrice * marginVal,tradeSymbol.value.showUnit) //计算所需保证金
	}
}

//计算所需保证金 价格*交易量(val/lastprice)/杠杆
const calculateMargin = (val: number) =>{
	showPriceInput.value = true
	let currentPrice = 0
	if(orderTypeObj.value.value ==='MARKET'){
		currentPrice = props.lastPrice
	}else{
		currentPrice = price.value
	}
	margin.value = roundDown(currentPrice * val/leverage.value.value,tradeSymbol.value.tradePriceDigit) //计算所需保证金
	if(marginBalance.value<margin.value){
		return uni.showToast({title: t('contract.insufficientMargin'), icon: 'none'})
	}
	tradeVal.value = roundDown(val * currentPrice,tradeSymbol.value.tradePriceDigit)
}

// 下单偏好设置
const checkPriceAndQuantity = () => {
  showPreferences.value = !showPreferences.value
}

const clickPriceInpupt = () => {
  showPriceInput.value = !showPriceInput.value
}

const changeChecked = (val:boolean) => {
  controlStore.setInputShow(val)
}

//切换价值方式，以USDT or 以BTC数量计价
const clickPreferences = () => {
  showPreferences.value = false
  settingAfterConfirmation.value = checkedSettings.value
}

const buyOrSellFun = (tradeDirection: string) => {
  direction.value = tradeDirection
  if(controlStore.getNoPopupWindows){
	  submitTrade()
  }else{
	showBuyPopup.value = true
  }
}

const noPopupWindows =(checked: boolean) =>{
	controlStore.setNoPopupWindows(checked)
}

const submitTrade = async () => {
	if(orderTypeObj.value.value ==='LIMIT' && !price.value){
		return uni.showToast({title: t('trading.enterValidPrice'), icon: 'none'})
	}else if(!tradeNum.value){
		return uni.showToast({title: t('trading.enterValidQuantity'), icon: 'none'})
	}
	const params = {
	  symbol: symbol.value,
	  tradeAmount: tradeNum.value,
	  tradePrice: price.value,
	  tradeType: orderTypeObj.value.value,
	  direction: direction.value,
	  leverage: leverage.value.value,
	  stopProfit: stopProfitVal.value,
	  stopLoss: stopLossVal.value,
	  allIn:value.value===100?true:false //是否全部
	}
	let data = null
	if(props.type === 'FUTURES'){
		data = await futuresTrade(params) //合约下单
	}else{
		data = await metalsTrade(params) //合约下单
	}
	if(!data || !data.errMsg){
		uni.showToast({title: t('trading.orderSuccess'), icon: 'success'})
	}
	showBuyPopup.value = false 
	loadSwapBalance() //下单成功重新读取可用保证金
	clearParams()
}

//清空交易参数
const clearParams= ()=>{
	tradeNum.value = 0 
	stopProfitVal.value = 0
	stopLossVal.value = 0
	value.value =0
	tradeVal.value = 0 
	margin.value =0 
}
defineExpose({
  loadData
})
</script>

<style scoped lang="scss">
.buyAndSellContract-index {
  :deep(.van-popover__wrapper) {
    width: 100%;
    padding-left: 15px;
    padding-right: 10px;
    background: #F6F7FB;
    border-radius: 8px;
  }
  .dropDownBox {
    height: 28px;
    line-height: 28px;
    .imgBox {
      image {
        width: 10px;
        height: 10px;
      }
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
      height: 58px;
      // line-height: 58px;
      .price-label {
        transition: font-size 0.2s ease; // 添加过渡效果
      }
      .checkTypeBox {
        .imgBox {
          .downIcon {
            width: 9px;
            height: 7px;
          }
        }
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
        padding: 0 10px; // 根据实际情况调整
        image {
          width: 14px;
          height: 14px;
        }
      }
    }
    .baseBox {
      border-radius: 8px;
      background: #F6F7FB;
    }
    .stopTemp {
      .imgBox {
        height: 100%;
        display: flex;
        align-items: center;
        .img-icon {
          width: 12px;
          height: 12px;
        }
      }
      .baseInput {
        background: #F6F7FB;
        border-radius: 8px 8px 8px 8px;
        height: 42px;
        .rightBox {
          image {
            width: 9px;
            height: 7px;
          }
        }
        .input-placeholder {
          // font-size: 14px;
          // color: #B0B0B0;
        }
      }
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
:deep(.van-radio__label) {
  width: 100%;
  padding-left: 10px;
}
.popupBtnBox {
  .myBtn {
    background: #1777FF;
    border-radius: 6px;
  }
}
.popupBtnBoxBuy {
  bottom: 20px;
  left: 0px;
  right: 0px;
  .myBtn {
    background: #0FB668;
    border-radius: 6px;
    border-color: #0FB668
  }
  .img-icon {
    width: 12px;
    height: 12px;
  }
}
.popupBtnBoxSell {
  bottom: 20px;
  left: 0px;
  right: 0px;
  .myBtn {
    background: #FF3E47;
    border-radius: 6px;
  }
  .img-icon {
    width: 12px;
    height: 12px;
  }
}
</style>