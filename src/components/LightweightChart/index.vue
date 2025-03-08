<template>
  <view class="chart-container">

    <!-- 时间选择工具栏 -->
    <view class="time-toolbar">
      <button 
        v-for="interval in timeIntervals" 
        :key="interval.value"
        :class="['time-btn', { active: selectedInterval === interval.value }]"
        @click="handleTimeSelect(interval.value)"
      >
        {{ interval.label }}
      </button>
    </view>

    <view v-if="isH5" ref="chartContainer" class="chart"></view>
    <view v-else class="unsupported">当前环境不支持图表展示</view>
  </view>
</template>

<script lang="ts">
export default { name: 'LightweightChart' } // 确保默认导出
</script>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { 
  createChart,
  type IChartApi,
  type ISeriesApi,
  CandlestickSeries,
  LineSeries,
  type CandlestickSeriesOptions,
  type LineSeriesOptions,
  type UTCTimestamp
} from 'lightweight-charts'

interface CandleData {
  time: number | UTCTimestamp
  open: number
  high: number
  low: number
  close: number
}

// 时间间隔配置
type TimeInterval = {
  value: number // 单位秒
  label: string
  formatter: (timestamp: UTCTimestamp) => string
}

interface EMAConfig {
  period: number
  color: string
  lineWidth?: number
  visible?: boolean
}

const props = defineProps<{
  data: CandleData[]
  emaConfigs?: EMAConfig[]
  theme?: 'light' | 'dark',
  initialInterval?: number
}>()

const emit = defineEmits<{
  (e: 'interval-change', interval: number): void
}>()

// 默认EMA配置
const defaultEMAConfigs: EMAConfig[] = [
  { period: 7, color: '#FF6D00', lineWidth: 2, visible: true },
  { period: 14, color: '#2962FF', lineWidth: 2, visible: true },
  { period: 28, color: '#B39DDB', lineWidth: 2, visible: true }
]

// 图表实例
const chartContainer = ref<HTMLElement | null>(null)
const isH5 = ref(process.env.UNI_PLATFORM === 'h5')
let chart: IChartApi | null = null
let candleSeries: ISeriesApi<CandlestickSeries> | null = null
const emaSeriesMap = ref(new Map<number, ISeriesApi<LineSeries>>())

// 时间间隔配置
const timeIntervals = ref<TimeInterval[]>([
  { value: 1,     label: '1秒',  formatter: (t:any) => new Date(t * 1000).toLocaleTimeString() },
  { value: 60,    label: '1分',  formatter: (t:any) => new Date(t * 1000).toLocaleTimeString('zh', { minute: '2-digit' }) },
  { value: 180,   label: '3分',  formatter: (t:any) => new Date(t * 1000).toLocaleTimeString('zh', { minute: '2-digit' }) },
  { value: 300,   label: '5分',  formatter: (t:any) => `${new Date(t * 1000).getHours()}:${String(new Date(t * 1000).getMinutes()).padStart(2, '0')}` },
  { value: 900,   label: '15分', formatter: (t:any) => `${new Date(t * 1000).getHours()}:${String(new Date(t * 1000).getMinutes()).padStart(2, '0')}` },
  { value: 1800,  label: '30分', formatter: (t:any) => `${new Date(t * 1000).getHours()}:00` },
  { value: 3600,  label: '1时',  formatter: (t:any) => `${new Date(t * 1000).getHours()}时` },
  { value: 7200,  label: '2时',  formatter: (t:any) => `${new Date(t * 1000).getHours()}时` },
  { value: 14400, label: '4时',  formatter: (t:any) => `${new Date(t * 1000).getDate()}日 ${new Date(t * 1000).getHours()}时` },
  { value: 21600, label: '6时',  formatter: (t:any) => `${new Date(t * 1000).getDate()}日` },
  { value: 43200, label: '12时', formatter: (t:any) => `${new Date(t * 1000).getMonth() + 1}-${new Date(t * 1000).getDate()}` },
  { value: 86400, label: '1日',  formatter: (t:any) => `${new Date(t * 1000).getMonth() + 1}-${new Date(t * 1000).getDate()}` },
  { value: 604800, label: '1周', formatter: (t:any) => `${new Date(t * 1000).getFullYear()}-${new Date(t * 1000).getMonth() + 1}` },
  { value: 2592000, label: '1月',formatter: (t:any) => `${new Date(t * 1000).getFullYear()}-${new Date(t * 1000).getMonth() + 1}` }
])

// 当前选中的时间间隔
const selectedInterval = ref(props.initialInterval || 60)

// EMA计算优化（处理数据不足的情况）
const calculateEMA = (period: number) => {
  if (!props.data || props.data.length === 0) return []
  
  const minDataPoints = Math.min(period, props.data.length)
  const k = 2 / (period + 1)
  const emaData = []
  let ema = props.data[0].close

  for (let i = 0; i < props.data.length; i++) {
    if (i < minDataPoints - 1) {
      // 数据不足时使用SMA
      const closes = props.data.slice(0, i + 1).map(d => d.close)
      ema = closes.reduce((a, b) => a + b, 0) / closes.length
    } else {
      ema = (props.data[i].close - ema) * k + ema
    }
    
    emaData.push({
      time: props.data[i].time,
      value: Number(ema.toFixed(4))
    })
  }
  return emaData
}

// 初始化EMA系列
const initEMASeries = () => {
  const configs = props.emaConfigs || defaultEMAConfigs
  
  configs.forEach(config => {
    // 如果已存在则跳过
    if (emaSeriesMap.value.has(config.period)) return
    
    const series = chart!.addSeries(LineSeries, {
      color: config.color,
      lineWidth: config.lineWidth || 2,
      lineStyle: 0, // 0: 实线
      priceScaleId: 'right',
      visible: config.visible ?? true
    })
    
    emaSeriesMap.value.set(config.period, series)
  })
}


// 更新EMA数据
const updateAllEMAData = () => {
  const configs = props.emaConfigs || defaultEMAConfigs
  
  configs.forEach(config => {
    const series = emaSeriesMap.value.get(config.period)
    if (!series) return
    
    const emaData = calculateEMA(config.period)
    series.setData(emaData)
  })
}

// 初始化图表
const initChart = async () => {
  if (!chartContainer.value) return

  chart = createChart(chartContainer.value.$el, {
    width: chartContainer.value.clientWidth,
    height: 400,
    layout: {
      background: { 
        color: props.theme === 'dark' ? '#1E1E1E' : '#FFFFFF' 
      },
      textColor: props.theme === 'dark' ? '#DDD' : '#333'
    },
    rightPriceScale: {
      scaleMargins: { top: 0.1, bottom: 0.1 }
    }
  })

  // 初始化蜡烛图
  candleSeries = chart.addSeries(CandlestickSeries, {
    upColor: '#26a69a',
    downColor: '#ef5350',
    borderVisible: false,
    wickUpColor: '#26a69a',
    wickDownColor: '#ef5350'
  })

  // 在initChart中添加时间格式化
  chart.applyOptions({
    timeScale: {
      tickMarkFormatter: (time: number) => {
        return new Date(time * 1000).toLocaleDateString()
      }
    }
  })

  // 初始化EMA
  initEMASeries()
  
  // 设置初始数据
  candleSeries.setData(props.data)
  updateAllEMAData()
  chart.timeScale().fitContent()
}

// // 响应数据变化
// watch(() => props.data, () => {
//   candleSeries?.setData(props.data)
//   updateAllEMAData()
//   chart?.timeScale().fitContent()
// }, { deep: true })

// // 响应配置变化
// watch(() => props.emaConfigs, (newConfigs) => {
//   // 移除旧EMA系列
//   emaSeriesMap.value.forEach((series, period) => {
//     if (!newConfigs?.some(c => c.period === period)) {
//       chart?.removeSeries(series)
//       emaSeriesMap.value.delete(period)
//     }
//   })
  
//   // 添加新EMA系列
//   initEMASeries()
//   updateAllEMAData()
// }, { deep: true })

// 主题响应优化
watch(() => props.theme, () => {
  chart?.applyOptions({
    layout: {
      background: { 
        color: props.theme === 'dark' ? '#1E1E1E' : '#FFFFFF' 
      },
      textColor: props.theme === 'dark' ? '#DDD' : '#333'
    }
  })
  // 重新应用EMA颜色
  props.emaConfigs?.forEach((newConfigs) => {
    // 移除旧EMA系列
    emaSeriesMap.value.forEach((series, period) => {
      if (!newConfigs?.some(c => c.period === period)) {
        chart?.removeSeries(series)
        emaSeriesMap.value.delete(period)
      }
    })

    // 添加新EMA系列
    initEMASeries()
    updateAllEMAData()
  }, { deep: true })
})

const updateTimeFormatter = () => {
  const currentInterval = timeIntervals.value.find(t => t.value === selectedInterval.value)
  
  chart?.applyOptions({
    timeScale: {  // 移动到 timeScale 子对象
      tickMarkFormatter: (time: UTCTimestamp) => {
        return currentInterval?.formatter(time) || ''
      }
    }
  })
}


// 处理时间选择
const handleTimeSelect = (interval: number) => {
  selectedInterval.value = interval
  emit('interval-change', interval)
  updateTimeFormatter()
  
  // 调整时间刻度可见性
  chart?.timeScale().applyOptions({
    secondsVisible: interval === 1
  })
}

// 数据更新示例方法（需根据实际业务实现）
const updateChartData = (data: CandleData[]) => {
  candleSeries?.setData(data)
  chart?.timeScale().fitContent()
}

// 图例交互
const visibleEMAs = computed(() => 
  (props.emaConfigs || defaultEMAConfigs).filter(c => 
    emaSeriesMap.value.get(c.period)?.options().visible !== false
  )
)

const toggleEMA = (period: number) => {
  const series = emaSeriesMap.value.get(period)
  if (series) {
    const visible = !series.options().visible
    series.applyOptions({ visible })
  }
}

onMounted(initChart)
onUnmounted(() => {
  emaSeriesMap.value.forEach(series => chart?.removeSeries(series))
  chart?.remove()
})

// 暴露方法给父组件
defineExpose({
  updateChartData
})
</script>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  height: 500px;
  position: relative;
}

.time-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px;
  background: var(--bg-color);
  position: sticky;
  top: 0;
  z-index: 10;
}

.time-btn {
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: #fff;
  transition: all 0.2s;
}

.time-btn.active {
  background: #007AFF;
  color: white;
  border-color: transparent;
}

.chart {
  width: 100%;
  height: calc(100% - 40px);
}


.legend {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255,255,255,0.9);
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 10;
}

.legend-item {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  margin: 2px 0;
  border-left: 3px solid;
  cursor: pointer;
  transition: opacity 0.3s;
}

.legend-item:hover {
  opacity: 0.8;
}
</style>
<style lang="scss">
// 隐藏水印
:deep(.tv-lightweight-charts) {
  .watermark {
    display: none !important;
  }
}
</style>