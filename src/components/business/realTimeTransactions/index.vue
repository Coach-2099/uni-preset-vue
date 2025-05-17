<template>
  <div class="realTimeTransactions-index">
    <dataDefault v-if="bidsList.length === 0 || asksList.length === 0" class="noData mt-25"></dataDefault>
    <div v-else>
      <div class="sellAndBuyTemp flex justify-between">
        <div 
          class="trapezoidLeft"
          :style="{ width: leftWidth + '%', 'min-width': '15%'  }"
        >
          <div class="leftBox flex items-center pr-5">
            <image
              src="/static/images/buyImg.png"
              mode="scaleToFill"
            />
            <div class="fs-12 ml-5">{{ leftWidth }}%</div>
          </div>
        </div>
        <div
          class="trapezoidRight text-right"
          :style="{ width: rightWidth + '%', 'min-width': '15%'  }"
        >
          <div class="rightBox flex items-center pl-5">
            <div class="fs-12 mr-5">{{ rightWidth }}%</div>
            <image
              src="/static/images/sellImg.png"
              mode="scaleToFill"
            />
          </div>
        </div>
      </div>
      <div class="sellAndBuyTip text-gray fs-14 mt-5 flex justify-between">
        <div class="fs-14 text-gray">{{ $t('operation.buy') }}</div>
        <div class="fs-14 text-gray"></div>
        <div class="fs-14">{{ $t('operation.sell') }}<!-- 0.1 --></div>
      </div>
      <div>
        <div class="contentTip text-gray fs-14 flex justify-between mt-20">
          <div class="fs-12">{{ $t('noun.quantity') }} ({{tradeToken}})</div>
          <div class="fs-12">{{ $t('noun.price') }}({{basicToken}})</div>
          <div class="fs-12">{{ $t('noun.quantity') }} ({{tradeToken}})</div>
        </div>
        <div class="contentBuySell w-100 flex justify-between mt-15">
          <div class="tempBox w-100">
            <div v-for="(item, index) in bidsList" :key="index" class="buyTemp pos-relative flex flex-1 justify-between">
              <div class="fs-12 text-black">{{type === 'METALS'||type === 'STOCK'?item.price.toFixed(2):item[1]}}</div>
              <div class="fs-12 text-light-green">{{type === 'METALS'||type === 'STOCK'?item.volume.toFixed(2):item[0]}}</div>
              <!-- 绿色背景层 -->
              <div 
                class="bg-layer pos-absolute"
                :style="{ 'width': buyWidth +'%' }"
              ></div>
            </div>
          </div>
          <div class="tempBox w-100">
            <div v-for="(item, index) in asksList" :key="index" class="sellTemp pos-relative flex flex-1 justify-between">
              <div class="fs-12 text-red">{{ type === 'METALS'||type === 'STOCK'?item.volume.toFixed(2):item[0] }}</div>
              <div class="fs-12 text-black">{{ type === 'METALS'||type === 'STOCK'?item.price.toFixed(2):item[1] }}</div>
              <!-- 红色背景层 -->
              <div 
                class="bg-layer pos-absolute"
                :style="{ 'width': sellWidth + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'
import { getDepth } from '@/api/quotes'
import { useUserStore } from '@/stores/user';
import { useControlStore } from '@/stores/control';
import dataDefault from '@/components/dataDefault/index.vue';
import { onShow } from '@dcloudio/uni-app';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const props = defineProps({
  type:{
	  type:String,
	  default:'SPOT'
  }
})

const controlStore = useControlStore();

const userStore = useUserStore();
const socketService = computed(() => userStore.socketService);
const leftWidth = ref(50)
const rightWidth = ref(50)

const buyWidth = ref(100)
const sellWidth = ref(100)

const bidsList = ref([]) // 买单
const asksList = ref([]) // 卖单

const tradeToken = ref('') //交易币种
const basicToken = ref('') //基础币种

const subSymbol = ref('') //当前订阅的交易对

watch(
  () => controlStore.getQuotesData(props.type)?.symbol,
  (newVal, oldVal) => {
    if(newVal){
		socketService.value.unsubscribe('depth',oldVal); //取消原有订阅
	}
  }
);

onMounted(()=>{
	if(controlStore.getQuotesData(props.type)?.symbol){
		subSymbol.value = controlStore.getQuotesData(props.type)?.symbol
	}
	loadData({klineType: props.type,
		  symbol: subSymbol.value})
})

const loadData = async (params: any) => {
  const data = await getDepth(params)
  bidsList.value = data.bids
  asksList.value = data.asks
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
	// 计算百分比（保留两位小数）
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
.realTimeTransactions-index {
  margin-top: 18px;
  .sellAndBuyTemp {
    padding: 0px 8px;
    // 容器设置过渡
    transition: all 0.3s ease-in-out;
    width: 100%;
    height: 23px;

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
        height: 23px;
        line-height: 23px;
        image {
          width: 23px;
          height: 23px;
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
        height: 23px;
        line-height: 23px;
        image {
          width: 23px;
          height: 23px;
        }
      }
    }
  }
  .sellAndBuyTip {
    padding-left: 8px;
    padding-right: 8px;
  }
  .noData {
    padding-bottom: 128px; // 确保底部有足够的空间
  }
  .contentTip {
    padding-left: 8px;
    padding-right: 8px;
  }
  .contentBuySell {
    gap: 12px;
    padding-left: 8px;
    padding-right: 8px;
    padding-bottom: 128px;
    isolation: isolate; // 创建新的层叠上下文
    backface-visibility: hidden; // 避免字体模糊
    contain: layout; // 限制重排范围
    .tempBox {
      // height: 28px;
      // line-height: 28px;
    }

    // 通用样式
    // [class$="Temp"] {
    //   overflow: hidden; // 新增隐藏溢出
    //   perspective: 1000px; // 开启3D加速
    //   height: 28px;
    //   line-height: 28px;
    //   .bg-layer {
    //     height: 28px;
    //     width: 100% !important; // 固定最大宽度
    //     transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    //     will-change: transform;
        
    //     // 买入动画方向
    //     .buyTemp & {
    //       transform: translateX(calc((1 - var(--progress, 1)) * 100%));
    //       transform-origin: right center;
    //     }
        
    //     // 卖出动画方向
    //     .sellTemp & {
    //       transform: translateX(calc((var(--progress, 0) - 1) * 100%));
    //       transform-origin: left center;
    //     }
    //   }
    // }
    .buyTemp, .sellTemp {
      overflow: hidden; // 新增隐藏溢出
      perspective: 1000px; // 开启3D加速
      height: 28px;
      line-height: 28px;
      .bg-layer {
        height: 28px;
        // width: 100% !important; // 固定最大宽度
        transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        will-change: transform;

        // 买入动画方向
        .buyTemp & {
          transform: translateX(calc((1 - var(--progress, 1)) * 100%));
          transform-origin: right center;
        }

        // 卖出动画方向
        .sellTemp & {
          transform: translateX(calc((var(--progress, 0) - 1) * 100%));
          transform-origin: left center;
        }
      }
    }
    // 优化视觉细节
    .buyTemp .bg-layer {
      background: linear-gradient(to left,
        rgba(15,182,104,0.1) 80%,
        rgba(15,182,104,0.05) 100%
      );
    }

    .sellTemp .bg-layer {
      background: linear-gradient(to right,
        rgba(255,62,71,0.05) 0%,
        rgba(255,62,71,0.1) 20%
      );
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

        // 方向适配
        .buyTemp & {
          right: 0;
          transform: translateX(100%);
        }
        .sellTemp & {
          left: 0;
          transform: translateX(-100%);
        }
      }
    }

    @keyframes trail {
      0% { opacity: 0; }
      20% { opacity: 1; }
      100% {
        opacity: 0;
        transform: translateX(0);
      }
    }

    // 买入样式
    .buyTemp {
      .bg-layer {
        right: 0;
        height: 100%;
        background: linear-gradient(90deg, rgba(15,182,104,0.1) 80%, rgba(15,182,104,0.05));
        border-radius: 4px 0 0 4px;
      }
    }
    // 卖出样式
    .sellTemp {
      .bg-layer {
        left: 0;
        height: 100%;
        background: linear-gradient(90deg, rgba(255,62,71,0.05), rgba(255,62,71,0.1) 20%);
        border-radius: 0 4px 4px 0;
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
</style>