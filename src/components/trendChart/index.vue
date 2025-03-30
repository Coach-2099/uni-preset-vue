<template>
  <div class="trend-temp">
    <!-- 这里是走势图！！ -->
    <lightWeightChart 
      ref="chartRef"
      v-model:data="candleData"
      :ema-configs="emaConfigs"
      :theme="theme"
      :initial-interval="currentInterval"
      @interval-change="handleIntervalChange"
      @load-more-data="handleLoadMore"
    ></lightWeightChart>
    <!-- <button @click="generateNewCandle">生成新K线</button>
    <button @click="addRandomData">添加数据</button> -->
    <!-- <button @click="toggleTheme">切换主题</button> -->
  </div>
</template>

<script lang="ts" setup>
import { onLoad, onShow } from '@dcloudio/uni-app';
import { ref, defineComponent, onUnmounted, nextTick } from 'vue';
import lightWeightChart from '@/components/LightweightChart/index.vue';
import type LightweightChartType from '@/components/LightweightChart/index.vue'
import type {  UTCTimestamp } from 'lightweight-charts';
import { getKlineHistory } from '@/api/quotes';
import { useControlStore } from '@/stores/control';

// stores
const controlStore = useControlStore();

const chartRef = ref<InstanceType<typeof LightweightChartType>>()

const theme = ref<'light' | 'dark'>('light')
const currentInterval = ref(300)

const symbolInfo = ref('BTC/USDT')
const timeInterval = ref('min_5') // K线周期,可用值:min_1,min_5,min_15,min_30,min_60,hour_4,day_1

// 新增时间间隔映射
const intervalMap:any = {
  'min_1': 1 * 24 * 60 * 60 * 1000,    // 1天
  'min_5': 3 * 24 * 60 * 60 * 1000,    // 3天
  'min_15': 7 * 24 * 60 * 60 * 1000,   // 1周
  'min_30': 14 * 24 * 60 * 60 * 1000,  // 2周
  'min_60': 30 * 24 * 60 * 60 * 1000,   // 1月
  'hour_4': 90 * 24 * 60 * 60 * 1000,   // 3月
  'day_1': 365 * 24 * 60 * 60 * 1000    // 1年
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

// 第一次进入时加载，后续通过socket添加数据
onLoad(() => {

})

onShow(() => {
  symbolInfo.value = 'BTC/USDT'
  if (controlStore.quotesData.symbol) symbolInfo.value = controlStore.quotesData.symbol
  loadData()
})


const loadData = async () => {
  const currentTime = new Date().getTime()
  const params = {
    symbol: symbolInfo.value, // 替换为实际的symbol
    period: getPeriodByInterval(currentInterval.value), // 新增映射方法
    startTime: currentTime - intervalMap[getPeriodByInterval(currentInterval.value)],
    endTime: currentTime
  }
  const { hasNext, klineList } = await getKlineHistory(params)
  if (klineList.length === 0) {
    console.log('没有数据')
    return
  }
  // 清空旧数据
  candleData.value = []
  // 根据时间间隔生成时间戳
  const interval = intervalMap[getPeriodByInterval(currentInterval.value)]
  for (let i = 0; i < klineList.length; i++) {
    candleData.value.push({
      time: Math.round((currentTime - (interval * (klineList.length - 1 - i))) / 1000), // 转换为秒级时间戳
      open: Number(klineList[i].open.toFixed(2)),
      high: Number(klineList[i].high.toFixed(2)),
      low: Number(klineList[i].low.toFixed(2)),
      close: Number(klineList[i].close.toFixed(2)),
      volume: Number(klineList[i].vol.toFixed(2))
    })
  }
}

const handleLoadMore = async({ start, end }) => {
  console.log('start!!!!', start)
  console.log('end!!!!', end)
}

// 生成初始蜡烛图数据
const generateCandleData = (count: number) => {
  let currentTime = Math.floor(Date.now() / 1000)
  let price = 100
  const data = []

  for (let i = 0; i < count; i++) {
    const open = price
    const close = open + (Math.random() - 0.5) * 10
    const high = Math.max(open, close) + Math.random() * 5
    const low = Math.min(open, close) - Math.random() * 5
    const volume = Math.random() * 10

    data.push({
      time: currentTime - (count - i - 1) * 3600, // 每小时一个K线
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Number(volume.toFixed(2))
    })
    price = close

  }
  return data
}


// 处理时间间隔变化
const handleIntervalChange = async (interval: number) => {
    // 先更新当前时间间隔
    currentInterval.value = interval
    // 清空旧数据
    candleData.value = []
    // 重新加载数据
    await loadData()
    // 强制更新图表
    nextTick(() => {
      // 假设LightweightChart组件有一个方法来更新数据，这里改为更新v-model绑定的数据
      candleData.value = [...candleData.value];
    })
  // const mockData = generateMockData(interval)
  // chartRef.value?.updateChartData(mockData)
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

// 生成对应时间间隔的测试数据
const generateMockData = (interval: number) => {
  const data = []
  const now = Math.floor(Date.now() / 1000) // 转换为秒级时间戳
  let price = 100
  
  // 生成100根K线
  for (let i = 0; i < 100; i++) {
    const open = price
    const close = open + (Math.random() - 0.5) * 10
    const high = Math.max(open, close) + Math.random() * 5
    const low = Math.min(open, close) - Math.random() * 5
    
    data.push({
      time: now - (100 - i) * interval as UTCTimestamp,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2))
    })
    
    price = close
  }
  return data
}


// 切换主题
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

// 生成新K线
const generateNewCandle = () => {
  const lastCandle = candleData.value[candleData.value.length - 1]
  const newTime = lastCandle.time + 3600 // 新增每小时数据
  
  const open = lastCandle.close
  const close = open + (Math.random() - 0.5) * 10
  const high = Math.max(open, close) + Math.random() * 5
  const low = Math.min(open, close) - Math.random() * 5

  candleData.value = [...candleData.value.slice(1), { // 保持数据量固定
    time: newTime,
    open: Number(open.toFixed(2)),
    high: Number(high.toFixed(2)),
    low: Number(low.toFixed(2)),
    close: Number(close.toFixed(2))
  }]
}

// 动态添加数据
const addRandomData = () => {
  const lastCandle = candleData.value[candleData.value.length - 1]
  const newCandle = {
    time: lastCandle.time + 3600,
    open: lastCandle.close,
    high: lastCandle.close + Math.random() * 5,
    low: lastCandle.close - Math.random() * 5,
    close: lastCandle.close + (Math.random() - 0.5) * 3
  }
  candleData.value = [...candleData.value, newCandle]
}

onUnmounted(() => {
  console.log('chartRef.value', chartRef)
  chartRef?.removeChart()
})

</script>

<style lang="scss" scoped>
.trend-temp {
  
}
</style>