<template>
  <div class="trend-temp">
    <div class="trend-temp-header">
      <div class="flex pos-fixed checkBitBox bg-white px-20">
        <div class="flex checckBitBtn mr-5" @click="checkBit">
          <div class="checckBitImgBox mr-5">
            <image
              src="/static/images/checkBit.png"
              mode="scaleToFill"
            />
          </div>
          <div>{{ symbolInfo }}</div>
        </div>
        <div v-if="rose > 0" class="increaseAndDecreaseBox flex items-center bg-light-success px-5 fs-12">
          <text class="text-light-green">{{ formartRose(rose) }}</text>
        </div>
        <div v-if="rose < 0" class="increaseAndDecreaseBox flex items-center bg-pink px-5 fs-12">
          <text class="text-red">{{ formartRose(rose) }}</text>
        </div>
      </div>
      <div class="flex items-center justify-between pt-10">
        <div class="flex-1">
          <div class="fs-28 text-red">{{ lastPrice }}</div>
          <div class="fs-12 text-black">≈ {{ lastPrice }} USD</div>
        </div>
        <div class="fs-12 text-gray flex-1">
          <div class="flex items-center justify-between">
            <div>{{$t('chart.indicators.high24h')}}</div>
            <div>{{ HIGH24h }}</div>
          </div>
          <div class="flex items-center justify-between">
            <div>{{$t('chart.indicators.low24h')}}</div>
            <div>{{ LOW24h }}</div>
          </div>
          <div class="flex items-center justify-between">
            <div>{{$t('chart.indicators.volume24h')}}</div>
            <div>{{ VOL24h }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 这里是走势图！！ -->
    <!-- #ifdef H5 -->
    <lightWeightChart 
      ref="chartRef"
      v-model:data="candleData"
      :ema-configs="emaConfigs"
      :theme="theme"
      :initial-interval="currentInterval"
      @interval-change="handleIntervalChange"
      :hasMore="hasMore"
      @load-more-data="handleLoadMore"
    ></lightWeightChart>
    <!-- #endif -->
    <!-- #ifdef APP-PLUS -->
    <appplusKlinecharts
      ref="appplusKlinechartsRef"
      v-model:chartData="candleData"
      v-model:updateTrigger="updateTrigger"
      @chart-ready="onChartReady"
    ></appplusKlinecharts>
    <!-- #endif -->

    <!-- <button @click="toggleTheme">切换主题</button> -->
    <floatingPanelProps ref="floatingPanelPropsRef"></floatingPanelProps>
  </div>
</template>

<script lang="ts" setup>
import { onLoad, onShow } from '@dcloudio/uni-app';
import { ref, defineComponent, onMounted, onUnmounted, nextTick, computed, watch } from 'vue';
import lightWeightChart from '@/components/LightweightChart/index.vue';
import appplusKlinecharts from '@/components/appplusKlinecharts/index.vue'
import { getKlineHistory,getTicker } from '@/api/quotes';
import { useControlStore } from '@/stores/control';
import { useUserStore } from '@/stores/user';
import floatingPanelProps from '@/components/business/floatingPanelSpot/index.vue';
import { formartRose } from '@/utils/util';
// import appLightweightChart from '@/components/appLightweightChart/index.vue';
import type {  UTCTimestamp } from 'lightweight-charts';

const props = defineProps({
  type:{
	  type:String,
	  default:'SPOT'
  }
})

// stores
const controlStore = useControlStore();
const userStore = useUserStore();
const socketService = computed(() => userStore.socketService);
const chartRef: any = ref(null)
const appplusKlinechartsRef: any = ref(null)
const floatingPanelPropsRef: any = ref(null) //行情列表引用

const themeVal = uni.getStorageSync('APP_THEME') || 'light'

const theme = ref<'light' | 'dark'>('light')
const currentInterval = ref(300) // 间隔多少时间的图表数据

const symbolInfo = ref('BTC/USDT')
const timeInterval = ref('min_15') // K线周期,可用值:min_1,min_5,min_15,min_30,min_60,hour_4,day_1
const rose = ref(0) //实时最新涨跌幅比例
const HIGH24h = ref(0) //24h最高
const LOW24h = ref(0) //24h最低
const VOL24h = ref(0) //24h交易额
const lastPrice = ref(0) //最新成交价
const hasMore = ref(true) //是否已读完K线全部数据

// 新增指示图表是否已准备好的状态
const chartReady = ref(false)

// 默认socket 时间间隔为5m
const defaultSocketVal = ref('1m'); // 5m

// 新增时间间隔映射
const intervalMap:any = {
  'min_1': 60 * 100 * 1000,    // 分钟
  'min_5': 5 * 60 * 100 * 1000,    // 5分钟
  'min_15': 15 * 60 * 100 * 1000,   //15
  'min_30': 30 * 60 * 100 * 1000,  //30
  'min_60': 60 * 60 * 100 * 1000,   // 60
  'hour_4': 240 * 60 * 100 * 1000,   // 4h
  'day_1': 1440 * 60 * 100 * 1000    // 1年
}

const candleData:any = ref([])
const updateTrigger = ref(0) // 用于更新图表数据的触发器
const candleDataString: any = ref('[]') // 用于传递给renderjs的字符串数据

// EMA配置
const emaConfigs = ref([
  {
    period: 7,
    color: '#FFA726',
    lineWidth: 2,
    visible: true
  },
  {
    period: 14,
    color: '#42A5F5',
    lineWidth: 2,
    visible: true
  },
  {
    period: 28,
    color: '#7E57C2',
    lineWidth: 2,
    visible: true
  }
])

// 颜色配置需要符合新的类型定义
const candleColors = ref({
  upColor: '#089981',
  downColor: '#F23645',
  wickUpColor: '#08998180',
  wickDownColor: '#F2364580',
  borderVisible: false, // 新增边框控制
  priceLineVisible: true // 显示价格线
})

// 修改 socket 监听部分
const subScribe = (symbol: string) => {
  // 设置新symbol的订阅和监听
  socketService.value.subscribe('ticker', symbol);
  socketService.value.on(`${symbol}-ticker`, (data: any) => {
    rose.value = Number((data.close-data.open)/data.open*100).toFixed(2)
    HIGH24h.value = data.high
    LOW24h.value = data.low
    VOL24h.value = data.vol
    lastPrice.value = data.close
  })

  // 订阅K线数据
  console.log('订阅k线数据')
  socketService.value.subscribe(`kline-${defaultSocketVal.value}`,symbol);
  socketService.value.on(`${symbol}-kline-${defaultSocketVal.value}`, (data: any, type?: string) => {
    console.log('socket 接收到数据！！！！！！！！！！！', data, 'type', type)
    // 处理重连事件
    if (type === 'reconnect') {
      console.log('检测到 Socket 重连，重新初始化图表数据');
      // 重新加载历史数据
      const currentTime = new Date().getTime();
      const endTime = currentTime - intervalMap[getPeriodByInterval(currentInterval.value)];
      loadData(endTime, currentTime, true);
      return;
    }
    // 确保时间戳是有效的UTCTimestamp（秒级）
    const candleTime = data.startTime / 1000
    if (data.isFinish) {
      // isFinish 为 true 时 push新数据
      const candle = {
        time: candleTime, // 转换为秒级时间戳
        open: Number(data.open),
        high: Number(data.high),
        low: Number(data.low),
        close: Number(lastPrice.value),
        volume: Number(data.vol)
      }
      
      // 针对不同平台使用不同方法更新图表
      // #ifdef H5
      chartRef.value?.appendNewCandle(candle)
      // #endif
      
      // #ifdef APP-PLUS
      // 只有在图表准备好后才更新
      if (chartReady.value && appplusKlinechartsRef.value) {
        appplusKlinechartsRef.value.appendNewCandle(candle)
        
        // 更新本地数据数组，确保数据同步
        candleData.value.push(candle)
        // 强制更新触发器
        updateTrigger.value = Date.now()
      }
      // #endif
    } else {
      // isFinish 为 false 时更新最新数据
      const candle = {
        open: Number(data.open),
        high: Number(data.high),
        low: Number(data.low),
        close: Number(lastPrice.value),
        time: candleTime,
        volume: Number(data.vol)
      }
      
      // 针对不同平台使用不同方法更新图表
      // #ifdef H5
      chartRef.value?.updateLastCandle(candle)
      // #endif
      
      // #ifdef APP-PLUS
      // 只有在图表准备好后才更新
      console.log('chartReady.value', chartReady.value)
      console.log('appplusKlinechartsRef.value', appplusKlinechartsRef.value)
      if (chartReady.value && appplusKlinechartsRef.value) {
        appplusKlinechartsRef.value.updateLastCandle(candle)
        
        // 更新本地数据数组中的最后一条，确保数据同步
        if (candleData.value.length > 0) {
          const lastIndex = candleData.value.length - 1
          if (candleData.value[lastIndex].time === candleTime) {
            candleData.value[lastIndex] = candle
            // 强制更新触发器
            updateTrigger.value = Date.now()
          }
        }
      }
      // #endif
    }
  })
}

// 新增图表准备好的回调
const onChartReady = () => {
  chartReady.value = true
  console.log('KLine图表已准备好')
  
  // 如果已经有数据，确保图表能够显示数据
  if (candleData.value.length > 0) {
    updateTrigger.value = Date.now()
  }
}

// 图表错误处理
const onChartError = (error:any) => {
  console.error('图表错误:', error);
};

// 新增以下监听代码,对新交易对进行订阅，取消老的订阅
watch(
  () => controlStore.getQuotesData(props.type)?.symbol,
  (newSymbol, oldSymbol) => {
    if (newSymbol) { //切换的交易对与原交易对相同不做处理
      console.log('数据', newSymbol, oldSymbol)
      // 取消旧symbol的订阅和监听
      // 如果存在旧数据则取消就数据的监听
      // 同时存在新数据和旧数据 则说明是切换 此时可以做取消监听 和 新数据监听
      // TODO: 是否需要判断同时存在新旧数据才会做新旧监听的改动？
      if (oldSymbol && newSymbol) {
        // 此处是交易数据监听
        socketService.value.unsubscribe('ticker', symbolInfo.value);
        // 此处是k线数据监听
        // 取消 旧数据的k线监听
        socketService.value.unsubscribe(`kline-${defaultSocketVal.value}`,symbolInfo.value);

        symbolInfo.value = newSymbol
        // 这里可以添加symbol变化后的处理逻辑
        handleIntervalChange(currentInterval.value, defaultSocketVal.value)
        subScribe(newSymbol)
      }
    }
  },
  { immediate: true } // 立即执行一次以获取初始值
)


onMounted(() => {
  nextTick(() => {
	  if (controlStore.getQuotesData(props.type)?.symbol){
		symbolInfo.value = controlStore.getQuotesData(props.type)?.symbol
	  }
    //延迟100毫秒订阅
    setTimeout(()=>{
      // 订阅 ticker
      if(lastPrice.value===0){
        getLastPrice()
      }
      console.log('第一次加载数据')
      subScribe(symbolInfo.value)
    },100)
    // 第一次进入要加载数据
    const currentTime = new Date().getTime()
    const endTime = currentTime- intervalMap[getPeriodByInterval(currentInterval.value)]
    loadData(endTime,currentTime,true) //初次加载
  })
})

onShow(() => {
  theme.value = themeVal
  if (controlStore.getQuotesData(props.type)?.symbol) symbolInfo.value = controlStore.getQuotesData(props.type)?.symbol
  // loadData()
})

	
const getLastPrice=async()=>{
	const params ={
		klineType: props.type,
		symbol: symbolInfo.value
	}
	const data = await getTicker(params)
	rose.value = Number((data.close-data.open)/data.open*100).toFixed(2)
	HIGH24h.value = data.high
	LOW24h.value = data.low
	VOL24h.value = data.vol
	lastPrice.value = data.close
}


const loadData = async (startTime: number,endTime:number,isFisrtLoad: boolean) => {
  const params = {
    symbol: symbolInfo.value, // 替换为实际的symbol
    period: getPeriodByInterval(currentInterval.value), // 新增映射方法
    startTime: startTime,
    endTime: endTime
  }
  const { hasNext, klineList } = await getKlineHistory(params)
  if (!klineList) {
    return
  }
  hasMore.value = hasNext
  // 清空旧数据
  if(isFisrtLoad) {
	  candleData.value = []
	  for (let i = 0; i < klineList.length; i++) {
		  const kline = {
        time: klineList[i].startTime/1000, // 转换为秒级时间戳
        open: Number(klineList[i].open),
        high: Number(klineList[i].high),
        low: Number(klineList[i].low),
        close: Number(klineList[i].close),
        volume: Number(klineList[i].vol)
		  }
			candleData.value.push(kline)
	  }
    console.log('加载数据长度变化!', candleData.value)
    // candleDataString.value = JSON.stringify(candleData.value)
    // console.log('candleDataString.value##', candleDataString.value)
  } else {
    // 加载数据
    console.log(' init result ={}',candleData.value.length)
	  const kl = klineList.length -1
	  for (let i = kl; i >= 0; i--) {
		  const kline = {
        time: klineList[i].startTime/1000, // 转换为秒级时间戳
        open: Number(klineList[i].open),
        high: Number(klineList[i].high),
        low: Number(klineList[i].low),
        close: Number(klineList[i].close),
        volume: Number(klineList[i].vol)
		  }
		  if (candleData.value[0].time > kline.time) {
        candleData.value.unshift(kline)
		  } else {
			  console.log('重复的time:'+candleData.value[0].startTime)
		  }
	  }
	  console.log('update result ={}',candleData.value.length)
	  // chartRef.value?.updateChartData(candleData.value)
  }
  console.log('加载数据 ')
}

const handleLoadMore = async({ start, end }) => {
  const endTime =	start*1000
  const startTime = endTime - intervalMap[getPeriodByInterval(currentInterval.value)]
  loadData(startTime,endTime,false)
}

// 新增时间间隔到API参数的映射方法
const getPeriodByInterval = (interval: number) => {
  const map: { [key: number]: string } = {
    60: 'min_1',
    300: 'min_5',
    900: 'min_15',  // 新增15分钟映射
    1800: 'min_30', // 新增30分钟映射
    3600: 'min_60',
    14400: 'hour_4',
    86400: 'day_1'
  }
  return map[interval] || 'min_5'
}

const checkBit = () => {
  console.log('点击')
  // METALS  SPOT   FUTURE
  floatingPanelPropsRef.value?.showFLoatingPanel({type: props.type})
}

// 切换主题
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

// 处理时间周期变化时确保更新 App 图表
const handleIntervalChange = async (interval: number, socketVal: string) => {
  // 先更新当前时间间隔
  currentInterval.value = interval
  defaultSocketVal.value = socketVal
  candleData.value = []
  
  // 清空旧数据
  // 重新加载数据
  const currentTime = new Date().getTime()
  const endTime = currentTime - intervalMap[getPeriodByInterval(currentInterval.value)]

  // 强制更新图表
  nextTick(() => {
    loadData(endTime, currentTime, true) //初次加载
    
    // 确保触发 App 端的更新
    // #ifdef APP-PLUS
    updateTrigger.value = Date.now()
    // #endif
  })
}

onUnmounted(() => {
  chartRef.value?.removeChart()
  // 移除监听
  socketService.value.unsubscribe('ticker',symbolInfo.value);
})

</script>

<style lang="scss" scoped>
.trend-temp {
  .trend-temp-header {
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
      .increaseAndDecreaseBox {
        border-radius: 3px 3px 3px 3px;
      }
    }
  }
}
</style>