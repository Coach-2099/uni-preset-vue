<template>
  <view class="chart-container">
    <!-- 时间选择工具栏 -->
    <view class="time-toolbar">
      <div 
        v-for="interval in filteredTimeIntervals" 
        :key="interval.value"
        @click="handleTimeSelect(interval.value)"
      >
        <text
          class="fs-12 mr-5"
          :class="selectedInterval === interval.value ? 'text-black' : 'text-gray'">
          {{ interval.label }}
        </text>
      </div>
    </view>
    <view class="flex items-cneter justify-cneter fs-10 px-5 mb-5">
      <div 
        v-for="ema in visibleEMAData" 
        :key="ema.period"
        class="flex items-center mr-5" 
        :style="{ color: ema.color }"
      >
        <div class="legend-dot mr-1" :style="{ backgroundColor: ema.color }"></div>
        <text class="mr-2">EMA{{ ema.period }}:</text>
        <text>{{ ema.value || '--' }}</text>
      </div>
    </view>
    <view id="chartTemp">
      <view v-if="isH5" ref="chartContainer" class="chart"></view>
      <view v-else class="unsupported">当前环境不支持图表展示</view>
      <!-- 遮罩 -->
      <!-- <van-overlay :show="isLoading" teleport="#chartTemp" z-index="100" /> -->
    </view>
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
  HistogramSeries,
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
  volume: number // 成交量
}

// 时间间隔配置
type TimeInterval = {
  value: number // 单位秒
  label: string
  showHeader: boolean
  formatter: (timestamp: UTCTimestamp) => string
}

interface EMAConfig {
  period: number
  color: string
  lineWidth?: number
  visible?: boolean
}

const isLoading = ref(true)

const props = defineProps<{
  data: CandleData[]
  emaConfigs?: EMAConfig[]
  theme?: 'light' | 'dark',
  initialInterval?: number,
  hasMore?: boolean
}>()

const emit = defineEmits<{
  (e: 'interval-change', interval: number): void
  (e: 'load-more-data', payload: { start: number; end: number }): void
}>()


// 默认EMA配置
const defaultEMAConfigs: EMAConfig[] = [
  { period: 7, color: '#FF6D00', lineWidth: 2, visible: true },
  { period: 14, color: '#2962FF', lineWidth: 2, visible: true },
  { period: 28, color: '#B39DDB', lineWidth: 2, visible: true }
]

const visibleEMAData = computed(() => {
  return Array.from(emaSeriesMap.value.values()).map(series => {
    const lastData = series.data().at(-1)
    return {
      period: series.options().title?.split(' ')[1],
      value: lastData?.value?.toFixed(2),
      color: series.options().color
    }
  }).filter(Boolean)
})

// 图表实例
const chartContainer = ref<HTMLElement | null>(null)
const isH5 = ref(process.env.UNI_PLATFORM === 'h5')
let chart: IChartApi | null = null
let candleSeries: ISeriesApi<CandlestickSeries> | null = null
const emaSeriesMap = ref(new Map<number, ISeriesApi<LineSeries>>())

// 新增tooltip引用
const toolTip = ref<HTMLElement | null>(null)

const volumeSeries = ref<ISeriesApi<'Histogram'> | null>(null) // 成交量系列响应式引用


// 时间间隔配置
const timeIntervals = ref<TimeInterval[]>([
  { 
    value: 60,    
    label: '1分', 
    showHeader: true, 
    formatter: (t: UTCTimestamp) => {
      const date = new Date(t * 1000)
      return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    } 
  },
  { 
    value: 300,   
    label: '5分', 
    showHeader: true, 
    formatter: (t: UTCTimestamp) => {
      const date = new Date(t * 1000)
      return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    }
  },
  { 
    value: 900,   // 新增15分钟配置
    label: '15分',
    showHeader: true,
    formatter: (t: UTCTimestamp) => {
      const date = new Date(t * 1000)
      return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    }
  },
  { 
    value: 1800,  // 新增30分钟配置
    label: '30分',
    showHeader: true,
    formatter: (t: UTCTimestamp) => {
      const date = new Date(t * 1000)
      return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    }
  },
  { 
    value: 3600,  
    label: '1时', 
    showHeader: true, 
    formatter: (t: UTCTimestamp) => {
      const date = new Date(t * 1000)
      return `${date.getMonth()+1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}时`
    }
  },
  { 
    value: 14400, 
    label: '4时', 
    showHeader: true, 
    formatter: (t: UTCTimestamp) => {
      const date = new Date(t * 1000)
      return `${date.getMonth()+1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}时`
    }
  },
  { 
    value: 86400, 
    label: '1日', 
    showHeader: true, 
    formatter: (t: UTCTimestamp) => {
      const date = new Date(t * 1000)
      return `${date.getMonth()+1}/${date.getDate()}`
    }
  },
])

// 添加计算属性
const filteredTimeIntervals = computed(() => {
  return timeIntervals.value.filter(t => t.showHeader)
})

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
      priceScaleId: 'none',
      // priceLineVisible: false,
      lastValueVisible: false,
      visible: config.visible ?? true,
      title: '' // 添加EMA标题
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
// const initChart = async () => {
//   if (!chartContainer.value) return

//   // 创建图表容器引用
//   const container = chartContainer.value.$el

//   // 创建tooltip元素
//   const toolTip = document.createElement('div')
//   toolTip.style.cssText = `
//     width: 132px; 
//     height: 120px; 
//     position: absolute;
//     display: none;
//     padding: 8px;
//     box-sizing: border-box;
//     font-size: 12px;
//     text-align: left;
//     z-index: 1000;
//     pointer-events: none;
//     border: 1px solid;
//     border-radius: 2px;
//     font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif;
//   `
//   container.appendChild(toolTip)

//   // 调整图表高度分配（蜡烛图70% + 成交量30%）
//   const chartHeight = 400
//   const priceChartHeight = chartHeight * 0.7
//   const volumeChartHeight = chartHeight * 0.3

//   chart = createChart(container, {
//     width: chartContainer.value.clientWidth,
//     height: chartHeight,
//     layout: {
//       background: {
//         color: props.theme === 'dark' ? '#1E1E1E' : '#FFFFFF'
//       },
//       textColor: props.theme === 'dark' ? '#DDD' : '#333'
//     },
//     rightPriceScale: {
//       // visible: false, // 显示右侧Y轴
//       scaleMargins: { top: 0.3, bottom: 0.25 },
//       borderVisible: false, // 新增：隐藏右侧Y轴轴线
//     },
//     crosshair: {
//       horzLine: {
//         visible: false,
//         labelVisible: false
//       },
//       vertLine: {
//         labelVisible: false
//       }
//     },
//     grid: {
//       vertLines: {
//         color: props.theme === 'dark' ? '#FFFFFF22' : '#00000022',
//         style: 2, // 2 表示虚线
//         visible: true
//       },
//       horzLines: {
//         color: props.theme === 'dark' ? '#FFFFFF22' : '#00000022',
//         style: 2, // 2 表示虚线
//         visible: true
//       }
//     }
//   })

//   // 初始化蜡烛图
//   candleSeries = chart.addSeries(CandlestickSeries, {
//     upColor: '#26a69a',
//     downColor: '#ef5350',
//     borderVisible: false,
//     wickUpColor: '#26a69a',
//     wickDownColor: '#ef5350',
//     title: '', // 添加系列标题
//   })

//   let volumeSeries: ISeriesApi<'Histogram'> | null = null
//   // 初始化成交量系列
//   volumeSeries = chart.addSeries(HistogramSeries, {
//     color: '#26a69a',
//     priceFormat: {
//       type: 'volume',
//     },
//     priceScaleId: 'volume', // 使用独立的priceScale
//     priceLineVisible: false,
//   })
//   // 设置图表高度
//   volumeSeries.priceScale().applyOptions({
//       // set the positioning of the volume series
//       scaleMargins: {
//           top: 0.85, // highest point of the series will be 70% away from the top
//           bottom: 0,
//       },
//   });


//   // 在设置数据时同时设置成交量数据
//   const volumeData = props.data.map(d => ({
//     time: d.time,
//     value: d.volume,
//     color: d.close > d.open ? '#26a69a' : '#ef5350' // 颜色与蜡烛图同步
//   }))
//   volumeSeries?.setData(volumeData)

  // 添加可见时间范围监听
const earliestEndDataTime = ref(0)
const subRange =() =>{
	chart.timeScale().subscribeVisibleTimeRangeChange((newRange:any) => {
    if (!newRange?.from || !props.hasMore) return;
    
    // 获取当前数据的最早时间戳
    const earliestDataTime = props.data[0]?.time as number;
    // 当可见范围开始时间接近数据集头部时触发加载
    if (newRange.from <= earliestDataTime && earliestEndDataTime.value!=earliestDataTime) {
		earliestEndDataTime.value = earliestDataTime
      // 触发父组件加载更多数据
      emit('load-more-data', {
        start: earliestDataTime, // 为最后一根K线时间
        end: newRange?.to
      });
    }
  });
}


//   // 在initChart中添加时间格式化
//   // chart.applyOptions({
//   //   timeScale: {
//   //     tickMarkFormatter: (time: number) => {
//   //       return new Date(time * 1000).toLocaleDateString()
//   //     },
//   //     borderVisible: false // 新增：隐藏底部X轴轴线
//   //   }
//   // })

//   // 初始化十字光标订阅
//   chart.subscribeCrosshairMove(param => {
//     if (!param.point || !param.time || !candleSeries) {
//       toolTip.style.display = 'none'
//       return
//     }

//     const candleData = param.seriesData?.get(candleSeries) as CandleData
//     const price = candleData?.close.toFixed(2) || ''
//     const close = candleData?.close || 0
//     const open = candleData?.open || 0
//     const high = candleData?.high || 0
//     const low = candleData?.low || 0
//     const Increase = ((close - open) / open * 100).toFixed(2)

//     // console.log('price', price)
//     // console.log('candleSeries.options()', candleSeries.options())
//     // console.log('param:', param.seriesData)

//     // 获取EMA系列数据（示例获取第一个EMA系列）
//     const emaValues = []
//     for (const [series, data] of param.seriesData) {
//       if (series.seriesType() === 'Line' && series.options().title?.startsWith('EMA')) {
//         emaValues.push({
//           period: series.options().title?.split(' ')[1],
//           value: (data as any).value?.toFixed(2)
//         })
//       }
//     }

//     // 更新tooltip内容
//     toolTip.innerHTML = `
//       <div class="${props.theme === 'dark' ? 'text-black' : 'text-gray'}">
//         ${new Date(param.time * 1000).toLocaleString()}
//       </div>
//       <div class="flex items-center justify-between text-gray">
//         <div>收:</div>
//         <div>${close}</div>
//       </div>
//       <div class="flex items-center justify-between text-gray">
//         <div>开:</div>
//         <div>${open}</div>
//       </div>
//       <div class="flex items-center justify-between text-gray">
//         <div>高:</div>
//         <div>${high}</div>
//       </div>
//       <div class="flex items-center justify-between text-gray">
//         <div>低:</div>
//         <div>${low}</div>
//       </div>
//       <div class="flex items-center justify-between text-gray">
//         <div>涨幅:</div>
//         <div>
//           <text class="${Increase > 0 ? 'text-green' :'text-red'}">${Increase}%</text>
//         </div>
//       </div>
//     `


//     // 更新tooltip位置
//     const { x, y } = param.point
//     const containerWidth = container.clientWidth
//     const containerHeight = container.clientHeight
//     const tooltipWidth = toolTip.offsetWidth
//     const tooltipHeight = toolTip.offsetHeight

//     let left = x + 15
//     if (left > containerWidth - tooltipWidth) {
//       left = x - tooltipWidth - 15
//     }

//     let top = y + 15
//     if (top > containerHeight - tooltipHeight) {
//       top = y - tooltipHeight - 15
//     }

//     Object.assign(toolTip.style, {
//       left: `${left}px`,
//       top: `${top}px`,
//       display: 'block',
//       background: props.theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
//       borderColor: props.theme === 'dark' ? '#666' : '#DDD'
//     })
//   })

//   // 初始化EMA
//   initEMASeries()
//   updateTimeFormatter()
//   // 设置初始数据
//   candleSeries.setData(props.data)
//   updateAllEMAData()
//   // chart.timeScale().fitContent()
//   // 设置可视数据
//   const visibleRange = chart.timeScale().getVisibleRange()
//   if (visibleRange && props.data.length > 0) {
//     // 改用逻辑范围计算
//     chart.timeScale().setVisibleLogicalRange({
//       from: Math.max(0, props.data.length - 30), // 显示最后120根K线
//       to: props.data.length - 1
//     })
//   } else {
//     chart.timeScale().fitContent()
//   }
// }

// 新增EMA最后K线更新方法
const updateEMAForLastCandle = (candle: CandleData) => {
  const configs = props.emaConfigs || defaultEMAConfigs
  
  configs.forEach(config => {
    const series = emaSeriesMap.value.get(config.period)
    if (!series) return

    // 获取当前EMA数据最后值
    const currentData = series.data()
    const lastEma = currentData[currentData.length - 1]?.value
    
    if (lastEma) {
      const k = 2 / (config.period + 1)
      const newEma = (candle.close - lastEma) * k + lastEma
      
      series.update({
        time: candle.time,
        value: Number(newEma.toFixed(4))
      })
    }
  })
}

// 新增EMA增量更新方法
const updateEMAIncrementally = (newCandles: CandleData[]) => {
  const configs = props.emaConfigs || defaultEMAConfigs
  
  configs.forEach(config => {
    const series = emaSeriesMap.value.get(config.period)
    if (!series || !series.data) return

    const existingData = series.data()
    const lastEma = existingData[existingData.length - 1]?.value || 0
    const k = 2 / (config.period + 1)
    
    // 处理每个新蜡烛图
    newCandles.forEach((candle, index) => {
      // 当已有数据不足时重新计算EMA
      if (existingData.length + index < config.period - 1) {
        const closes = props.data
          .slice(0, existingData.length + index + 1)
          .map(d => d.close)
        const sma = closes.reduce((a, b) => a + b, 0) / closes.length
        series.update({ time: candle.time, value: sma })
      } else {
        const prevEma = index === 0 ? lastEma : existingData[existingData.length + index - 1]?.value
        const newEma = (candle.close - prevEma) * k + prevEma
        series.update({
          time: candle.time,
          value: Number(newEma.toFixed(4))
        })
      }
    })
  })
}

// 新增图表结构初始化方法
const initChartStructure = async () => {
  if (!chartContainer.value) return

  // 创建图表容器引用
  const container = chartContainer.value.$el
  
  // 创建tooltip元素
  const toolTipEl = document.createElement('div')
  toolTipEl.style.cssText = `
    width: 132px;
    height: 120px;
    position: absolute;
    display: none;
    padding: 8px;
    box-sizing: border-box;
    font-size: 12px;
    text-align: left;
    z-index: 1000;
    pointer-events: none;
    border: 1px solid;
    border-radius: 2px;
    font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif;
  `
  container.appendChild(toolTipEl)
  toolTip.value = toolTipEl

  // 创建基础图表结构（与之前initChart中的图表创建部分相同）
  chart = createChart(container, {
    width: chartContainer.value.clientWidth,
    height: 400,
    layout: { 
      background: {
        color: props.theme === 'dark' ? '#1E1E1E' : '#FFFFFF'
      },
      textColor: props.theme === 'dark' ? '#DDD' : '#333'
     },
    rightPriceScale: { 
      scaleMargins: { top: 0.3, bottom: 0.25 },
      borderVisible: false, // 新增：隐藏右侧Y轴轴线
     },
    crosshair: {
      horzLine: {
        visible: false,
        labelVisible: false
      },
      vertLine: {
        labelVisible: false
      }
    },
    grid: {
      vertLines: {
        color: props.theme === 'dark' ? '#FFFFFF22' : '#00000022',
        style: 2, // 2 表示虚线
        visible: true
      },
      horzLines: {
        color: props.theme === 'dark' ? '#FFFFFF22' : '#00000022',
        style: 2, // 2 表示虚线
        visible: true
      }
    },
  })

  // 添加十字光标订阅
  chart.subscribeCrosshairMove(param => {
    if (!param.point || !param.time || !candleSeries) {
      toolTipEl.style.display = 'none'
      return
    }

    const candleData = param.seriesData?.get(candleSeries) as CandleData
    // 获取EMA系列数据
    const emaValues = Array.from(emaSeriesMap.value.values()).map(series => {
      const data = param.seriesData?.get(series) as { value?: number }
      return {
        period: series.options().title?.split(' ')[1],
        value: data?.value?.toFixed(2)
      }
    })

    const close = candleData?.close || 0
    const open = candleData?.open || 0
    const high = candleData?.high || 0
    const low = candleData?.low || 0
    const Increase = ((close - open) / open * 100).toFixed(2)
    // 更新tooltip内容
    toolTipEl.innerHTML = `
      <div class="${props.theme === 'dark' ? 'text-black' : 'text-gray'}">
        ${new Date(param.time * 1000).toLocaleString()}
      </div>
      ${candleData ? `
        <div class="flex items-center justify-between text-gray">
          <div>收:</div><div>${close}</div>
        </div>
        <div class="flex items-center justify-between text-gray">
          <div>开:</div><div>${open}</div>
        </div>
        <div class="flex items-center justify-between text-gray">
          <div>高:</div>
          <div>${high}</div>
        </div>
        <div class="flex items-center justify-between text-gray">
          <div>低:</div>
          <div>${low}</div>
        </div>
        <div class="flex items-center justify-between text-gray">
          <div>涨幅:</div>
          <div>
            <text class="${Increase > 0 ? 'text-green' :'text-red'}">${Increase}%</text>
          </div>
        </div>
      ` : ''}
    `

    // 更新tooltip位置
    const { x, y } = param.point
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight
    const tooltipWidth = toolTipEl.offsetWidth
    const tooltipHeight = toolTipEl.offsetHeight

    let left = x + 15
    let top = y + 15
    if (left > containerWidth - tooltipWidth) left = x - tooltipWidth - 15
    if (top > containerHeight - tooltipHeight) top = y - tooltipHeight - 15

    Object.assign(toolTipEl.style, {
      left: `${left}px`,
      top: `${top}px`,
      display: 'block',
      background: props.theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
      borderColor: props.theme === 'dark' ? '#666' : '#DDD'
    })
  })

  // 初始化蜡烛图系列（不设置数据）
  candleSeries = chart.addSeries(CandlestickSeries, {
    upColor: '#26a69a',
    downColor: '#ef5350',
    borderVisible: false,
    wickUpColor: '#26a69a',
    wickDownColor: '#ef5350'
  })

  // 初始化成交量系列（不设置数据）
  volumeSeries.value = chart.addSeries(HistogramSeries, {
    color: '#26a69a',
    priceFormat: { type: 'volume' },
    priceScaleId: 'volume'
  })
  
  // 应用成交量系列高度设置
  // 在应用scaleMargins前确保priceScale存在
  if (volumeSeries.value ) {
    const priceScale = chart.priceScale('volume')
    priceScale.applyOptions({
      visible: false,
      scaleMargins: {
        top: 0.85,
        bottom: 0
      },
    })
  }
}

// 修改后的数据渲染方法
const renderChartData = async () => {
  console.log('来重新渲染 chart', chart)
  console.log('来重新渲染 candleSeries', candleSeries)
  if (!chart || !candleSeries) return

  // 新增数据排序和验证
  const sortedData = [...props.data].sort((a, b) => a.time - b.time)
  validateDataConsistency(sortedData)

  // 设置蜡烛图数据
  candleSeries.setData(props.data)
  console.log('设置蜡烛图 ', candleSeries)
  console.log('props.data', props.data)

  // 设置成交量数据
  resetVolumeSeries()

  // 初始化EMA系列
  initEMASeries()
  updateAllEMAData()
  
  // 设置可视范围
  chart.timeScale().setVisibleLogicalRange({
    from: Math.max(0, props.data.length - 30),
    to: props.data.length - 1
  })
}

// 新增数据验证方法
const validateDataConsistency = (data: CandleData[]) => {
  for (let i = 1; i < data.length; i++) {
    if (data[i].time <= data[i - 1].time) {
      console.error(`数据顺序错误: index=${i}, time=${data[i].time}, prev=${data[i - 1].time}`)
      throw new Error('Invalid data sequence')
    }
  }
}

// 清空图表
const removeChart = () => {
  if (chart) {
    // 移除tooltip元素
    toolTip.value?.parentNode?.removeChild(toolTip.value)
    // 正确销毁图表实例
    chart.remove()
    // 清除所有引用
    chart = null
    candleSeries = null
    // 清理EMA系列
    emaSeriesMap.value.clear()
    // 移除DOM容器（重要！）
    chartContainer.value?.$el?.parentNode?.removeChild(chartContainer.value.$el)
  }
}

// 新增重新绘制方法
const redrawChart = async () => {
  // 清除所有引用
  // chart?.removeSeries(candleSeries)

  // 移除tooltip元素
  toolTip.value?.parentNode?.removeChild(toolTip.value)
  // 清理EMA系列
  emaSeriesMap.value.clear()
  // 清理蜡烛图
  candleSeries?.setData([]);
  // 清理成交量
  volumeSeries.value?.setData([]);
  chart = null
  candleSeries = null
  // chart?.remove()
  // 这里是清除所有引用
  // chart?.removeSeries(candleSeries)
}

const resetVolumeSeries = () => {
  // 仅更新数据而不重建系列
  if (volumeSeries.value && props.data?.length) {
    const volumeData = props.data.map(d => ({
      time: d.time,
      value: d.volume,
      color: d.close > d.open ? '#26a69a' : '#ef5350'
    }))
    volumeSeries.value.setData(volumeData)
    
    // 确保价格刻度配置
    const priceScale = chart?.priceScale('volume')
    priceScale?.applyOptions({
      visible: false,
      scaleMargins: { top: 0.85, bottom: 0 }
    })
  }
}

// 主题响应优化
watch(() => 
  props.data, (newVal:any, oldVal:any) => {
    console.log('chart', chart)
    console.log('candleSeries', candleSeries)
    console.log('newVal', newVal)
    if (!chart || !candleSeries || newVal.length === 0) return
    // 存在图表实例才做图表重绘
    // if (chart && candleSeries) redrawChart()
    if (newVal.length > 0 && chart) {
      console.log('修改!!!!!!!')
      renderChartData()  // 数据变化时只更新渲染
    }
  },
  {
    deep: true, // 添加深度监听
    immediate: true // 初始化时自动执行
  }
)

// 暴露给父组件的更新方法
const exposeMethods = {
  // 更新最后一条K线
  updateLastCandle(candle: CandleData) {
    updateLastCandle(candle)
    // chart?.timeScale().scrollToPosition(1, false)
  },
  
  // 追加新K线
  appendNewCandle(candle: CandleData) {
    appendNewCandle(candle)
    // chart?.timeScale().scrollToPosition(1, false)
  },
  
  // 全量替换数据（用于历史数据）
  replaceAllData(newData: CandleData[]) {
    candleSeries?.setData(newData)
    volumeSeries.value?.setData(newData.map(createVolumeData))
    updateAllEMAData()
  },
  //清空数据
  clearData(){
	  redrawChart() //重新绘制
  }
}


// 保留原有更新逻辑（稍作调整）
const updateLastCandle = (candle: CandleData) => {
  candleSeries?.update(candle)
  volumeSeries.value?.update(createVolumeData(candle))
  updateEMAForLastCandle(candle)
}

// 新增专用方法：追加新数据
const appendNewCandle = (candle: CandleData) => {
  candleSeries?.update(candle)
  volumeSeries.value?.update(createVolumeData(candle))
  updateEMAIncrementally([candle])
}

// 新增工具方法
const createVolumeData = (d:any) => ({
  time: d.time,
  value: d.volume,
  color: d.close > d.open ? '#26a69a' : '#ef5350'
})

const getLastCandleTime = () => {
  const data = candleSeries?.data()
  return data?.[data.length - 1]?.time as UTCTimestamp
}


// 更新时间格式
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
  console.log('触发蜡烛图修改')
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

onMounted(async () => {
  await nextTick()
  await initChartStructure()  // 先初始化结构
  if (props.data.length > 0) {
    await renderChartData()   // 如果有初始数据立即渲染
  }
  subRange() //订阅时间轴范围
})


onUnmounted(() => {
  emaSeriesMap.value.forEach(series => chart?.removeSeries(series))
  chart?.remove()
})

// 暴露方法给父组件
defineExpose({
  ...exposeMethods,
  updateChartData,
  getLastCandleTime,
  removeChart,
  redrawChart, // 暴露新方法
})
</script>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  height: 450px;
  position: relative;
}

.time-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px 5px;
  background: var(--bg-color);
  position: sticky;
  top: 0;
  z-index: 10;
}

.chart {
  width: 100%;
  height: 400px;
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
:deep(#tv-attr-logo) {
  display: none !important;
}
</style>