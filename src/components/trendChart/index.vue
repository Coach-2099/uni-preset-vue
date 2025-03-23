<template>
  <div class="trend-temp">
    <!-- 这里是走势图！！ -->
    <lightWeightChart 
      ref="chartRef"
      :data="candleData"
      :ema-configs="emaConfigs"
      :theme="theme"
      :initial-interval="currentInterval"
      @interval-change="handleIntervalChange"
    ></lightWeightChart>
    <!-- <button @click="generateNewCandle">生成新K线</button>
    <button @click="addRandomData">添加数据</button> -->
    <!-- <button @click="toggleTheme">切换主题</button> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, defineComponent, onUnmounted, nextTick } from 'vue';
import lightWeightChart from '@/components/LightweightChart/index.vue';
import type LightweightChartType from '@/components/LightweightChart/index.vue'
import type {  UTCTimestamp } from 'lightweight-charts';

const chartRef = ref<InstanceType<typeof LightweightChartType>>()

const theme = ref<'light' | 'dark'>('light')
const currentInterval = ref(300)

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

    data.push({
      time: currentTime - (count - i - 1) * 3600, // 每小时一个K线
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2))
    })
    price = close

  }
  return data
}

const candleData = ref(generateCandleData(10000))

// 处理时间间隔变化
const handleIntervalChange = async (interval: number) => {
  const mockData = generateMockData(interval)
  chartRef.value?.updateChartData(mockData)
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