<template>
  <div class="priceFluctuations-temp" ref="contentRef">
    <div class="flex justify-between align-center">
      <div>
        <p class="fs-12 text-gray">{{ $t('priceFluctuations.price') }}</p>
        <p class="fs-12 text-gray">({{basicToken}})</p>
      </div>
      <div class="flex justify-between align-center">
        <div class="mr-5">
          <p class="fs-12 text-gray text-right">{{ $t('noun.quantity') }}</p>
          <p class="fs-12 text-gray text-right">({{tradeToken}})</p>
        </div>
        <div class="downBtn">
          <image
            src="/static/images/downGray.png"
            mode="scaleToFill"
          />
        </div>
      </div>
    </div>
	<!-- 卖单深度列表-->
	<div class="contentTemp">
	  <div class="listBox">
	    <div v-for="(item, index) in bidsList" :key="index" class="contentList pos-relative flex justify-between items-center">
	      <div class="fs-12 text-red">{{type === 'METALS'?item.price.toFixed(2):item[0]}}</div>
	      <div class="fs-12 text-black">{{type === 'METALS'?item.volume.toFixed(2):item[1]}}</div>
	      <div
	        class="bg-layer pos-absolute sellTemp"
	        :style="{ 'width': fluctuationWidth +'%' }"
	      ></div>
	    </div>
	  </div>
	</div>

    <div class="contentTitle mt-5">
      <p class="fs-16 text-light-green">{{lastPrice}}</p>
      <p class="fs-12 text-black">
        <text>≈ {{lastPrice}}</text>
        <text class="ml-5">USD</text>
      </p>
    </div>
	<!-- 买单深度列表-->
   <div class="contentTemp">
     <div class="listBox">
       <div v-for="(item, index) in asksList" :key="index" class="contentList pos-relative flex justify-between items-center">
         <div class="fs-12 text-light-green">{{type === 'METALS'?item.price.toFixed(2):item[0]}}</div>
         <div class="fs-12 text-black">{{type === 'METALS'?item.volume.toFixed(2):item[1]}}</div>
         <div
           class="bg-layer pos-absolute buyTemp"
           :style="{ 'width': fluctuationWidth +'%' }"
         ></div>
       </div>
     </div>
   </div>

    <div class="sellAndBuyTemp flex justify-between items-center mt-5">
      <div 
        class="trapezoidLeft"
        :style="{ width: leftWidth + '%', 'min-width': '35%' }"
      >
        <div class="leftBox flex items-center pr-5">
          <image
            src="/static/images/buyImg.png"
            mode="scaleToFill"
          />
          <div class="fs-8 ml-5">{{ leftWidth }}%</div>
        </div>
      </div>
      <div 
        class="trapezoidRight text-right"
        :style="{ width: rightWidth + '%', 'min-width': '35%' }"
      >
        <div class="rightBox flex items-center pl-5">
          <div class="fs-8 mr-5">{{ rightWidth }}%</div>
          <image
            src="/static/images/sellImg.png"
            mode="scaleToFill"
          />
        </div>
      </div>
    </div>

    <!-- <div class="depthTemp mt-5">
      <div class="baseSelect px-10 w-100 flex justify-between items-center">
        <div class="leftText">
          <text class="fs-10 text-black">0.01</text>
        </div>
        <div class="downIcon">
          <image
            src="/static/images/downGray.png"
            mode="scaleToFill"
          />
        </div>
      </div>
    </div> -->

  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted, onDeactivated } from 'vue';
import { onLaunch, onShow, onLoad, onUnload } from "@dcloudio/uni-app";
import { getDepth } from '@/api/quotes'
import { useControlStore } from '@/stores/control'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const props = defineProps({
  lastPrice: {
    type: Number,
    default: 0
  },
  type:{
	  type:String,
	  default:'SPOT'
  }
})

const userStore = useUserStore();
const socketService = computed(() => userStore.socketService);

const controlStore = useControlStore();
const { inputShow } = storeToRefs(controlStore);

const fluctuationWidth = ref(10);
const leftWidth = ref(50);
const rightWidth = ref(50);

const bidsList = ref([]) // 买单
const asksList = ref([]) // 卖单

const tradeToken = ref('') //交易币种
const basicToken = ref('') //基础币种

const subSymbol = ref('') //当前订阅的交易对

const MAX_DEPTH_LENGTH = 7 // 最大显示20条深度数据

// 监控交易对变化
watch(
  () => controlStore.getQuotesData(props.type)?.symbol,
  (newVal, oldVal) => {
    if(newVal){
      socketService.value.unsubscribe('depth',oldVal); //取消原有订阅
    }
  }
);

onShow(() => {
  // #ifdef APP-PLUS
  if(controlStore.getQuotesData(props.type)?.symbol){
    subSymbol.value = controlStore.getQuotesData(props.type)?.symbol
  }
  loadData({klineType: props.type, symbol: subSymbol.value})
  // #endif
})

onMounted(()=>{
  // #ifdef H5
	if(controlStore.getQuotesData(props.type)?.symbol){
		subSymbol.value = controlStore.getQuotesData(props.type)?.symbol
	}
	loadData({klineType: props.type, symbol: subSymbol.value})
  // #endif
})

onUnmounted(() => {})

onDeactivated(() => {
  // 原代码中 controlStore.getQuotesData 是一个函数，需要传入参数调用后才能访问 symbol 属性
  // 修改为调用函数并传入 props.type 参数

  const NowSymbol = controlStore.getQuotesData(props.type)?.symbol
  socketService.value.unsubscribe('depth',NowSymbol);
})

// 加载数据
const loadData = async (params: any) => {
  const data = await getDepth(params)
  bidsList.value = data.bids
  asksList.value = data.asks
  bidsList.value = data.bids.slice(0, MAX_DEPTH_LENGTH)
  asksList.value = data.asks.slice(0, MAX_DEPTH_LENGTH)
  const symbol = params.symbol.split('/')
  tradeToken.value = symbol[0]
  basicToken.value = symbol[1]
  depthData(bidsList.value,asksList.value,props.type)
  if(params.symbol){
	  subSymbol.value = params.symbol
  }else{
	  subSymbol.value = controlStore.getQuotesData(props.type)?.symbol
  }
  subdepth(subSymbol.value)
}

const subdepth =(symbol:string)=>{
	socketService.value.subscribe('depth',symbol);
  socketService.value.on(`${symbol}-depth`, (item: any) => {
		bidsList.value = item.bids
		asksList.value = item.asks
    // 对实时数据也添加长度限制
    bidsList.value = item.bids.slice(0, MAX_DEPTH_LENGTH)
    asksList.value = item.asks.slice(0, MAX_DEPTH_LENGTH)
		depthData(bidsList.value,asksList.value,props.type)
  })
}

const depthData =(bidsList:any,asksList:any,type:string)=>{
	// 新增计算逻辑
	let bidsTotal = 0
	let asksTotal = 0
	if(type === 'METALS'){
	//贵金属行情数据格式不一样
		bidsTotal = bidsList.reduce((sum, item) => sum + item.volume, 0)
		asksTotal = asksList.reduce((sum, item) => sum + item.volume, 0)
	}else{
		bidsTotal = bidsList.reduce((sum, item) => sum + Number(item[1]), 0)
		asksTotal = asksList.reduce((sum, item) => sum + Number(item[1]), 0)
	}
	const total = bidsTotal + asksTotal
	// 计算百分比
	leftWidth.value = total > 0
	  ? Number(((asksTotal / total) * 100).toFixed(0))
	  : 50 // 默认值防止除零错误
	  rightWidth.value = Number(100 - leftWidth.value).toFixed(0)
}
defineExpose({
  loadData
})
</script>

<style lang="scss" scoped>
.priceFluctuations-temp {
  .downBtn {
    image {
      width: 7px;
      height: 5px;
    }
  }
  .contentTemp {
    .listBox {
      .contentList {
        .bg-layer {
          height: 19px;
          // width: 100% !important; // 固定最大宽度
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          will-change: transform;

          right: 0;
          height: 100%;
          border-radius: 4px 0 0 4px;
        }

        .buyTemp {
          background: linear-gradient(90deg, rgba(15,182,104,0.1) 80%, rgba(15,182,104,0.05));
        }

        .sellTemp {
          background: linear-gradient(90deg, rgba(255,62,71,0.05), rgba(255,62,71,0.1) 20%);
        }

        .bg-layer {
          &::after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            width: 4px;
            background: rgba(255,255,255,0.3);
            animation: trail 0.8s ease-out;

          }
        }

      }
    }
  }
  .sellAndBuyTemp {
    // padding: 0px 8px;
    // 容器设置过渡
    transition: all 0.3s ease-in-out;
    width: 100%;
    height: 20px;
    line-height: 20px;
    [class^="trapezoid"] {
      transition: all 0.3s ease-in-out;
      height: 100%;
      position: relative;
      // background: #409eff;
      display: flex;
      align-items: center;
      color: white;

      &::after {
        content: '';
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 1px;
        background: rgba(255,255,255,0.5);
      }
    }

    .trapezoidLeft {
      background: #e0f5ec;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      color: #0FB668;
      clip-path: polygon(
        0 0,
        100% 0,
        calc(100% - 5px) 100%, // 10%宽度偏移
        0 100%
      );
      // padding-left: 12%; // 动态补偿
      justify-content: flex-start;
      .leftBox {
        height: 20px;
        line-height: 20px;
        image {
          width: 20px;
          height: 20px;
        }
      }
    }

    .trapezoidRight {
      background: #fff0f2;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      color: #FF3E47;
      clip-path: polygon(
        5px 0, // 10%宽度偏移
        100% 0,
        100% 100%,
        0 100%
      );
      // padding-right: 12%; // 动态补偿
      justify-content: flex-end;
      .rightBox {
        height: 20px;
        line-height: 20px;
        image {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
  .depthTemp {
    .baseSelect {
      border-radius: 6px;
      height: 22px;
      line-height: 22px;
      background: var(--color-background-box);
      .downIcon {
        image {
          width: 5px;
          height: 4px;
        }
      }
    }
  }
}
</style>