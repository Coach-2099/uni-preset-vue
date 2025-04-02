<template>
  <div class="trend-temp">
    <div class="trend-temp-header">
      <div class="flex">
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
      <div class="flex items-center justify-between">
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
      @load-more-data="handleLoadMore"
    ></lightWeightChart>
    <!-- <button @click="generateNewCandle">生成新K线</button>
    <button @click="addRandomData">添加数据</button> -->
    <!-- <button @click="toggleTheme">切换主题</button> -->
    <floatingPanelProps ref="floatingPanelPropsRef"></floatingPanelProps>
  </div>
</template>

<script lang="ts" setup>
import { onLoad, onShow } from '@dcloudio/uni-app';
import { ref, defineComponent, onMounted, onUnmounted, nextTick, computed, watch } from 'vue';
import lightWeightChart from '@/components/LightweightChart/index.vue';
import type LightweightChartType from '@/components/LightweightChart/index.vue'
import { getKlineHistory } from '@/api/quotes';
import { useControlStore } from '@/stores/control';
import { useUserStore } from '@/stores/user';
import floatingPanelProps from '@/components/business/floatingPanelSpot/index.vue';
import type {  UTCTimestamp } from 'lightweight-charts';

// stores
const controlStore = useControlStore();
const userStore = useUserStore();
const socketService = computed(() => userStore.socketService);

// 新增以下监听代码
watch(
  () => controlStore.quotesData.symbol,
  (newSymbol, oldSymbol) => {
    if (newSymbol) {
      console.log('oldSymbol', oldSymbol)
      // 取消旧symbol的订阅和监听
      if (oldSymbol) {
        socketService.value.unsubscribe('ticker', oldSymbol);
        socketService.value.off(`${oldSymbol}-ticker`);
      }

      symbolInfo.value = newSymbol
      
      // 设置新symbol的订阅和监听
      socketService.value.subscribe('ticker', newSymbol);
      socketService.value.on(`${newSymbol}-ticker`, (data: any) => {
        rose.value = Number((data.close-data.open)/data.open*100).toFixed(2)
        HIGH24h.value = data.high
        LOW24h.value = data.low
        VOL24h.value = data.vol
        lastPrice.value = data.close
      })
      // 这里可以添加symbol变化后的处理逻辑
      loadData()
    }
  },
  { immediate: true } // 立即执行一次以获取初始值
)

const chartRef = ref<InstanceType<typeof LightweightChartType>>()
const floatingPanelPropsRef: any = ref(null) //行情列表引用

const theme = ref<'light' | 'dark'>('light')
const currentInterval = ref(300) // 间隔多少时间的图表数据

const symbolInfo = ref('BTC/USDT')
const timeInterval = ref('min_5') // K线周期,可用值:min_1,min_5,min_15,min_30,min_60,hour_4,day_1
const rose = ref(0) //实时最新涨跌幅比例
const HIGH24h = ref(0) //24h最高
const LOW24h = ref(0) //24h最低
const VOL24h = ref(0) //24h交易额
const lastPrice = ref(0) //最新成交价

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

onMounted(() => {
  nextTick(() => {
	  if (controlStore.quotesData.symbol){
      symbolInfo.value = controlStore.quotesData.symbol
	  }
    // 订阅 ticker
    socketService.value.subscribe('ticker',symbolInfo.value);
	  socketService.value.on(`${symbolInfo.value}-ticker`, (data: any) => {
			rose.value = Number((data.close-data.open)/data.open*100).toFixed(2)
      HIGH24h.value = data.high
      LOW24h.value = data.low
      VOL24h.value = data.vol
      lastPrice.value = data.close
	  })

    // 订阅k线
    socketService.value.subscribe('kline',symbolInfo.value);
    socketService.value.on(`${symbolInfo.value}-kline`, (data: any) => {
      // 确保时间戳是有效的UTCTimestamp（秒级）
      const candleTime = Math.round(data.startTime / 1000)
      // 获取当前最后一条数据的时间
      const lastCandleTime = chartRef.value?.getLastCandleTime() // 需要在子组件暴露该方法

      if (data.isFinish || candleTime > lastCandleTime) {
        // isFinish 为 true 时 push新数据
        const candle = {
          time: candleTime, // 转换为秒级时间戳
          open: Number(data.open.toFixed(2)),
          high: Number(data.high.toFixed(2)),
          low: Number(data.low.toFixed(2)),
          close: Number(data.close.toFixed(2)),
          volume: Number(data.vol.toFixed(2))
        }
        chartRef.value?.appendNewCandle(candle)
      } else if (candleTime === lastCandleTime) {
        // isFinish 为 false 时更新最新数据
        const candle = {
          open: Number(data.open.toFixed(2)),
          high: Number(data.high.toFixed(2)),
          low: Number(data.low.toFixed(2)),
          close: Number(data.close.toFixed(2)),
          time: candleTime,
          volume: Number(data.vol.toFixed(2))
        }
        chartRef.value?.updateLastCandle(candle)
      } else {
        console.warn('时间戳不匹配无法更新', { candleTime, lastCandleTime })
      }
    })
    // 第一次进入要加载数据
    loadData()
  })
})

onShow(() => {
  symbolInfo.value = 'BTC/USDT'
  if (controlStore.quotesData.symbol) symbolInfo.value = controlStore.quotesData.symbol
  // loadData()
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
  console.log('加载数据 ')
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

const checkBit = () => {
  floatingPanelPropsRef.value?.showFLoatingPanel()
}

// 切换主题
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

onUnmounted(() => {
  console.log('chartRef.value', chartRef)
  chartRef?.removeChart()
  // 移除监听
  socketService.value.unsubscribe('ticker',symbol.value);
})

</script>

<style lang="scss" scoped>
.trend-temp {
  .trend-temp-header {
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
</style>