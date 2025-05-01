<template>
  <view class="chart-container">
    <!-- 时间选择工具栏 -->
    <view class="time-toolbar">
      <div 
        v-for="interval in filteredTimeIntervals" 
        :key="interval.value"
        @click="handleTimeSelect(interval.value, interval.socketVal)"
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
    
    <!-- App端图表容器 -->
    <!-- 修改 WebView 容器的样式和设置 -->
    <view class="chart-wrapper" style="height: 400px; width: 100%;">
      <web-view 
        :src="chartUrl" 
        @message="onWebviewMessage"
        :webview-styles="{
          progress: false,
          width: '100%',
          height: '400px'
        }"
        ref="chartWebview"
        style="width: 100%; height: 400px;"
      ></web-view>
    </view>
  </view>
</template>


<script lang="ts">
export default { name: 'appLightweightChart' } // 确保默认导出
</script>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { useI18n } from 'vue-i18n';

interface CandleData {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// 时间间隔配置
type TimeInterval = {
  value: number // 单位秒
  label: string
  socketVal: string
  showHeader: boolean
  formatter: (timestamp: number) => string
}

interface EMAConfig {
  period: number
  color: string
  lineWidth?: number
  visible?: boolean
  value?: number
}

const props = defineProps<{
  data: CandleData[]
  emaConfigs?: EMAConfig[]
  theme?: 'light' | 'dark',
  initialInterval?: number,
  hasMore?: boolean
}>()

const { t } = useI18n();

const emit = defineEmits<{
  (e: 'interval-change', interval: number, socketVal: string): void
  (e: 'load-more-data', payload: { start: number; end: number }): void
  (e: 'chartReady'): void
  (e: 'chartError', error: any): void
  (e: 'ema-update', emaData: EMAConfig[]): void
}>()

// 默认EMA配置
const defaultEMAConfigs: EMAConfig[] = [
  { period: 7, color: '#FF6D00', lineWidth: 2, visible: true },
  { period: 14, color: '#2962FF', lineWidth: 2, visible: true },
  { period: 28, color: '#B39DDB', lineWidth: 2, visible: true }
]

// EMA数据存储
const visibleEMAData = ref<EMAConfig[]>([])

// 当前选中的时间间隔
const selectedInterval = ref(props.initialInterval || 60)

// Chart URL 生成
const chartUrl = computed(() => {
  const baseUrl = '/hybrid/html/index.html'
  const params = new URLSearchParams({
    theme: props.theme || 'light',
    interval: selectedInterval.value.toString(),
    chartId: chartInstanceId.value
  })
  return `${baseUrl}?${params}`
})

// 创建一个唯一的图表实例ID
const chartInstanceId = ref(`chart_${Date.now()}_${Math.floor(Math.random() * 1000)}`)
const chartWebview = ref<any>(null)

// 图表是否准备好的状态
const chartReady = ref(false)

// 时间间隔配置
const timeIntervals = ref<TimeInterval[]>([
  { 
    value: 60,    
    label: t('chart.timeframes.min1'),
    socketVal: '1m',
    showHeader: true, 
    formatter: (t: number) => {
      const date = new Date(t * 1000)
      return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    } 
  },
  { 
    value: 300,   
    label: t('chart.timeframes.min5'),
    socketVal: '5m',
    showHeader: true, 
    formatter: (t: number) => {
      const date = new Date(t * 1000)
      return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    }
  },
  { 
    value: 900,   
    label: t('chart.timeframes.min15'),
    socketVal: '15m',
    showHeader: true,
    formatter: (t: number) => {
      const date = new Date(t * 1000)
      return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    }
  },
  { 
    value: 1800,  
    label: t('chart.timeframes.min30'),
    socketVal: '30m',
    showHeader: true,
    formatter: (t: number) => {
      const date = new Date(t * 1000)
      return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    }
  },
  { 
    value: 3600,  
    label: t('chart.timeframes.hour1'), 
    socketVal: '1h',
    showHeader: true, 
    formatter: (t: number) => {
      const date = new Date(t * 1000)
      return `${date.getMonth()+1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}时`
    }
  },
  { 
    value: 14400, 
    label: t('chart.timeframes.hour4'),
    socketVal: '4h',
    showHeader: true, 
    formatter: (t: number) => {
      const date = new Date(t * 1000)
      return `${date.getMonth()+1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}时`
    }
  },
  { 
    value: 86400, 
    label: t('chart.timeframes.day1'),
    socketVal: '1d',
    showHeader: true, 
    formatter: (t: number) => {
      const date = new Date(t * 1000)
      return `${date.getMonth()+1}/${date.getDate()}`
    }
  },
])

// 添加计算属性
const filteredTimeIntervals = computed(() => {
  return timeIntervals.value.filter(t => t.showHeader)
})

// 监听数据变化
watch(() => props.data, (newData, oldData) => {
  if (newData.length === 0) return
  
  if (!chartReady.value) {
    // 数据已准备好但图表尚未准备好，等待图表准备完成
    return
  }

  // 发送数据到 WebView
  sendMessageToWebView({
    type: 'setData',
    data: {
      candleData: newData,
      emaConfigs: props.emaConfigs || defaultEMAConfigs,
      hasMore: props.hasMore
    }
  })
}, { deep: true })

// 监听主题变化
watch(() => props.theme, (newTheme) => {
  if (!chartReady.value) return
  
  sendMessageToWebView({
    type: 'setTheme',
    data: newTheme
  })
})

// 监听 EMA 配置变化
watch(() => props.emaConfigs, (newConfigs) => {
  if (!chartReady.value || !newConfigs) return
  
  sendMessageToWebView({
    type: 'updateEMAConfigs',
    data: newConfigs
  })
}, { deep: true })

// 处理 WebView 消息
const onWebviewMessage = (event: any) => {
  const message = event.detail.data || {}
  console.log('从 WebView 收到消息:', message)

  switch (message.type) {
    case 'chartReady':
      chartReady.value = true
      emit('chartReady')
      
      // 图表准备好后，发送初始数据
      if (props.data.length > 0) {
        sendMessageToWebView({
          type: 'setData',
          data: {
            candleData: props.data,
            emaConfigs: props.emaConfigs || defaultEMAConfigs,
            hasMore: props.hasMore
          }
        })
      }
      break
      
    case 'chartError':
      emit('chartError', message.data)
      break
      
    case 'emaUpdate':
      visibleEMAData.value = message.data
      emit('ema-update', message.data)
      break
      
    case 'intervalChange':
      handleTimeSelect(message.data.interval, message.data.socketVal)
      break
      
    case 'loadMore':
      emit('load-more-data', message.data)
      break
  }
}

// 发送消息到 WebView
const sendMessageToWebView = (message: any) => {
  if (!chartWebview.value) return

  console.log('发送消息到 WebView:', message)
  
  // 使用 uni.postMessage 向 WebView 发送消息
  const webview = chartWebview.value?.webView
  if (webview) {
    uni.postMessage({
      data: message,
      to: webview
    })
  } else {
    console.error('WebView 实例未找到')
  }
}

// 处理时间选择
const handleTimeSelect = (interval: number, socketVal: string) => {
  if (selectedInterval.value === interval) return
  
  console.log('选中时间间隔:', interval, socketVal)
  selectedInterval.value = interval
  
  // 向父组件通知时间间隔变化
  emit('interval-change', interval, socketVal)
  
  // 如果图表已准备好，则向 WebView 发送时间间隔变化消息
  if (chartReady.value) {
    sendMessageToWebView({
      type: 'changeInterval',
      data: { interval, socketVal }
    })
  }
}

// 暴露给父组件的方法
const updateLastCandle = (candle: CandleData) => {
  if (!chartReady.value) return
  
  sendMessageToWebView({
    type: 'updateLastCandle',
    data: candle
  })
}

const appendNewCandle = (candle: CandleData) => {
  if (!chartReady.value) return
  
  sendMessageToWebView({
    type: 'appendNewCandle',
    data: candle
  })
}

const clearData = () => {
  if (!chartReady.value) return
  
  sendMessageToWebView({
    type: 'clearData'
  })
}

onMounted(() => {
  console.log('图表组件已挂载')
})

onUnmounted(() => {
  console.log('图表组件已卸载')
  // 清理相关资源
})

// 暴露方法给父组件
defineExpose({
  updateLastCandle,
  appendNewCandle,
  clearData
})
</script>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  height: auto; /* 从固定高度改为自适应 */
  position: relative;
  overflow: hidden; /* 防止内容溢出 */
}

.chart-wrapper {
  width: 100%;
  height: 400px;
  position: relative;
  overflow: hidden; /* 防止内容溢出 */
}

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

.chart-wrapper {
  width: 100%;
  height: 400px;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 4px;
}
</style>