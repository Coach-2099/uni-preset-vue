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
        <div class="increaseAndDecreaseBox px-5">
          <text class="text-red fs-12">{{rose}}%</text>
        </div>
      </div>
      <div class="flex items-center justify-between pt-10">
        <div class="flex-1">
          <div class="fs-28 text-red">{{ lastPrice }}</div>
          <div class="fs-12 text-black">≈ {{ lastPrice }} USD</div>
        </div>
        <div class="fs-12 text-gray flex-1">
          <div class="flex items-center justify-between">
            <div>24h最高</div>
            <div>{{ HIGH24h }}</div>
          </div>
          <div class="flex items-center justify-between">
            <div>24h最低</div>
            <div>{{ LOW24h }}</div>
          </div>
          <div class="flex items-center justify-between">
            <div>24h交易额</div>
            <div>{{ VOL24h }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 这里是走势图！！ -->
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
    <!-- <button @click="toggleTheme">切换主题</button> -->
    <floatingPanelProps ref="floatingPanelPropsRef"></floatingPanelProps>
  </div>
</template>

<script lang="ts" setup>
import { onLoad, onShow } from '@dcloudio/uni-app';
import { ref, defineComponent, onMounted, onUnmounted, nextTick, computed, watch } from 'vue';
import lightWeightChart from '@/components/LightweightChart/index.vue';
import type LightweightChartType from '@/components/LightweightChart/index.vue'
import { getKlineHistory,getTicker } from '@/api/quotes';
import { useControlStore } from '@/stores/control';
import { useUserStore } from '@/stores/user';
import floatingPanelProps from '@/components/business/floatingPanelSpot/index.vue';
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
const chartRef = ref<InstanceType<typeof LightweightChartType>>()
const floatingPanelPropsRef: any = ref(null) //行情列表引用

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


// 新增以下监听代码,对新交易对进行订阅，取消老的订阅
watch(
  () => controlStore.quotesData.symbol,
  (newSymbol, oldSymbol) => {
    if (newSymbol) { //切换的交易对与原交易对相同不做处理
      // 取消旧symbol的订阅和监听
	  socketService.value.unsubscribe('ticker', symbolInfo.value);
	  socketService.value.off(`${symbolInfo.value}-ticker`);

      symbolInfo.value = newSymbol
	  // 这里可以添加symbol变化后的处理逻辑
	  handleIntervalChange(currentInterval.value)
      
      // 设置新symbol的订阅和监听
      socketService.value.subscribe('ticker', newSymbol);
      socketService.value.on(`${newSymbol}-ticker`, (data: any) => {
        rose.value = Number((data.close-data.open)/data.open*100).toFixed(2)
        HIGH24h.value = data.high
        LOW24h.value = data.low
        VOL24h.value = data.vol
        lastPrice.value = data.close
      })
    }
  },
  { immediate: true } // 立即执行一次以获取初始值
)


onMounted(() => {
  nextTick(() => {
	  if (controlStore.quotesData.symbol){
      symbolInfo.value = controlStore.quotesData.symbol
	  }
	   //延迟100毫秒订阅
	setTimeout(()=>{
		// 订阅 ticker
		socketService.value.subscribe('ticker',symbolInfo.value);
		  socketService.value.on(`${symbolInfo.value}-ticker`, (data: any) => {
				rose.value = Number((data.close-data.open)/data.open*100).toFixed(2)
		  HIGH24h.value = data.high
		  LOW24h.value = data.low
		  VOL24h.value = data.vol
		  lastPrice.value = data.close
		  })
		  
		  if(lastPrice.value===0){
			  getLastPrice()
		  }

		// 订阅k线
		socketService.value.subscribe('kline',symbolInfo.value);
		socketService.value.on(`${symbolInfo.value}-kline`, (data: any) => {
		  // 确保时间戳是有效的UTCTimestamp（秒级）
		  const candleTime = data.startTime / 1000

		  if (data.isFinish) {
			// isFinish 为 true 时 push新数据
			const candle = {
			  time: candleTime, // 转换为秒级时间戳
			  open: Number(data.open.toFixed(2)),
			  high: Number(data.high.toFixed(2)),
			  low: Number(data.low.toFixed(2)),
			  close: Number(lastPrice.value),
			  volume: Number(data.vol.toFixed(2))
			}
			chartRef.value?.appendNewCandle(candle)
		  }  {
			// isFinish 为 false 时更新最新数据
			const candle = {
			  open: Number(data.open.toFixed(2)),
			  high: Number(data.high.toFixed(2)),
			  low: Number(data.low.toFixed(2)),
			  close: Number(lastPrice.value),
			  time: candleTime,
			  volume: Number(data.vol.toFixed(2))
			}
			chartRef.value?.updateLastCandle(candle)
		  }
		})
	},100)
    // 第一次进入要加载数据
	const currentTime = new Date().getTime()
	const endTime = currentTime- intervalMap[getPeriodByInterval(currentInterval.value)]
    loadData(endTime,currentTime,true) //初次加载
  })
})

onShow(() => {
  if (controlStore.quotesData.symbol) symbolInfo.value = controlStore.quotesData.symbol
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
  if(isFisrtLoad){
	candleData.value = []
	  for (let i = 0; i < klineList.length; i++) {
		  const kline = {
			time: klineList[i].startTime/1000, // 转换为秒级时间戳
			open: Number(klineList[i].open.toFixed(2)),
			high: Number(klineList[i].high.toFixed(2)),
			low: Number(klineList[i].low.toFixed(2)),
			close: Number(klineList[i].close.toFixed(2)),
			volume: Number(klineList[i].vol.toFixed(2))
		  }
			candleData.value.push(kline)
	  }
  }else{
	   console.log(' init result ={}',candleData.value.length)
	  const kl = klineList.length -1
	  for (let i = kl; i >= 0; i--) {
		  const kline = {
			time: klineList[i].startTime/1000, // 转换为秒级时间戳
			open: Number(klineList[i].open.toFixed(2)),
			high: Number(klineList[i].high.toFixed(2)),
			low: Number(klineList[i].low.toFixed(2)),
			close: Number(klineList[i].close.toFixed(2)),
			volume: Number(klineList[i].vol.toFixed(2))
		  }
		  if(candleData.value[0].time > kline.time){
		  			  candleData.value.unshift(kline)
		  }else{
			  console.log('重复的time:'+candleData.value[0].startTime)
		  }
	  }
	  console.log(' update result ={}',candleData.value.length)
	  chartRef.value?.updateChartData(candleData.value)
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
  floatingPanelPropsRef.value?.showFLoatingPanel({type: 'SPOT'})
}

// 切换主题
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

// 处理时间周期变化
const handleIntervalChange = async (interval: number) => {
    // 先更新当前时间间隔
    currentInterval.value = interval
    // 清空旧数据
    // candleData.value = []
	chartRef.value?.clearData()
    // 重新加载数据
	const currentTime = new Date().getTime()
	const endTime = currentTime- intervalMap[getPeriodByInterval(currentInterval.value)]
	loadData(endTime,currentTime,true) //初次加载
    // 强制更新图表
    nextTick(() => {
      // 假设LightweightChart组件有一个方法来更新数据，这里改为更新v-model绑定的数据
      candleData.value = [...candleData.value];
    })
  // const mockData = generateMockData(interval)
  // chartRef.value?.updateChartData(mockData)
}

onUnmounted(() => {
  console.log('chartRef.value', chartRef)
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
        background: #FFD3D9;
        border-radius: 3px 3px 3px 3px;
      }
    }
  }
}
</style>