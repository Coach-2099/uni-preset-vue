<template>
  <view class="chart-container">
    <!-- 关键点：在这里绑定数据和监听函数 -->
    <canvas
      type="2d"
      id="kline-chart"
      class="kline-chart"
      :style="{ width: '100%', height: '450px' }"
      :chart-data-string="chartDataString" 
      :change:chart-data-string="klineRender.updateChartData"
      @error="handleError"
    ></canvas>
  </view>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  chartData: {
    type: Array,
    default: () => []
  },
  updateTrigger: {
    type: [Number, String, Object],
    default: 0
  }
});

const emit = defineEmits(['chartReady', 'chartError']);

// 图表实例状态
const chartInstance = ref(null);
// 使用字符串形式传递数据给renderjs
const chartDataString = ref('[]');

// 监听chartData变化，转换为字符串
watch(() => props.chartData, (newData) => {
  console.log('Vue中数据变化，转换为字符串传递给renderjs', newData?.length || 0);
  try {
    // 确保数据不为空
    const safeData = Array.isArray(newData) ? newData : [];
    // 更新数据字符串 - 重要：这里需要创建新的字符串值才能触发更新
    chartDataString.value = JSON.stringify(safeData);
    console.log('数据已转换为字符串，长度:', chartDataString.value.length);
  } catch (error) {
    console.error('数据转换错误:', error);
    chartDataString.value = '[]';
  }
}, { deep: true, immediate: true });

// 新增：监听 updateTrigger 变化，强制更新图表
watch(() => props.updateTrigger, (newValue, oldValue) => {
  console.log('检测到 updateTrigger 变化:', newValue);
  if (newValue !== oldValue && klineRender && typeof klineRender.forceUpdate === 'function') {
    // 强制刷新图表，重新渲染数据
    klineRender.forceUpdate();
  }
});

// 处理 Canvas 错误
function handleError(e) {
  console.error('Canvas error:', e);
  emit('chartError', e);
}

// 用于接收 renderjs 发送的事件
function handleMessage(event) {
  if (event.detail && event.detail.type === 'chartCreated') {
    // 图表已创建
    chartInstance.value = true;
    emit('chartReady', true);
  } else if (event.detail && event.detail.type === 'chartError') {
    // 图表创建或操作出错
    emit('chartError', event.detail.error);
  }
}

// 方法用于实时更新最新的K线和添加新的K线
function updateLastCandle(candle) {
  console.log('调用 updateLastCandle 方法', candle);
  
  if (klineRender && typeof klineRender.updateLastCandle === 'function') {
    try {
      // 将 candle 对象转换为字符串
      const candleStr = JSON.stringify(candle);
      klineRender.updateLastCandle(candleStr);
      return true;
    } catch (error) {
      console.error('updateLastCandle 调用出错:', error);
      return false;
    }
  } else {
    console.warn('klineRender 或 updateLastCandle 方法不存在');
    return false;
  }
}

function appendNewCandle(candle) {
  console.log('调用 appendNewCandle 方法', candle);
  
  if (klineRender && typeof klineRender.appendNewCandle === 'function') {
    try {
      // 将 candle 对象转换为字符串
      const candleStr = JSON.stringify(candle);
      klineRender.appendNewCandle(candleStr);
      return true;
    } catch (error) {
      console.error('appendNewCandle 调用出错:', error);
      return false;
    }
  } else {
    console.warn('klineRender 或 appendNewCandle 方法不存在');
    return false;
  }
}

// 暴露方法供外部调用
defineExpose({
  handleMessage,
  updateLastCandle,
  appendNewCandle
});
</script>

<script module="klineRender" lang="renderjs">
// 导入 klinecharts 和配置
import { init, dispose } from 'klinecharts';
import { config } from './klineConfig.js';

export default {
  // renderjs 数据
  data() {
    return {
      chart: null,
      resizeObserver: null,
      chartData: []
    }
  },
  
  // 组件挂载时执行
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        console.log('初始化图表延迟执行');
        this.initChart();
        this.setupResizeHandler();
      }, 300);
    });
  },
  
  methods: {
    // 关键方法：接收并处理数据变化
    updateChartData(newValue, oldValue, ownerInstance, instance) {
      console.log('监听到数据变化', newValue?.length || 0, oldValue?.length || 0);
      
      try {
        // 解析数据
        if (!newValue) {
          console.warn('接收到空数据');
          return;
        }
        
        // 解析JSON数据
        const rawData = JSON.parse(newValue);
        console.log('数据解析成功，原始数据点数量:', rawData.length);
        
        // 转换数据格式，处理时间戳
        const formattedData = rawData.map(item => {
          console.log('item!!!!!!!', item)
          // 创建符合 KLineCharts 要求的格式
          return { 
            timestamp: typeof item.time === 'number' ? item.time * 1000 : Number(item.time) * 1000, // 转为毫秒级
            open: Number(item.open),
            high: Number(item.high),
            low: Number(item.low),
            close: Number(item.close),
            volume: Number(item.volume)
          };
        }).filter(item => {
          console.log('筛选时间', item.timestamp)
          // 验证时间戳有效性
          if (isNaN(item.timestamp) || !isFinite(item.timestamp)) {
            console.error('发现无效时间戳:', item.timestamp);
            return false;
          }
          return true;
        });
        
        console.log('数据格式转换完成，有效数据点:', formattedData.length);
        this.chartData = formattedData;
        
        // 更新图表
        this.updateChart();
      } catch (error) {
        console.error('处理数据变化错误:', error);
      }
    },
    
    // 新增：强制更新图表方法，响应 updateTrigger 变化
    forceUpdate() {
      console.log('强制更新图表...');
      if (!this.chart || !this.chartData || this.chartData.length === 0) {
        console.warn('无法强制更新图表：图表未初始化或数据为空');
        return;
      }
      
      try {
        // 创建新的图表数据引用，确保图表能检测到变化
        const clonedData = JSON.parse(JSON.stringify(this.chartData));
        
        // 清除现有数据
        this.chart.clearData();
        
        // 使用延时确保清除和添加不会冲突
        setTimeout(() => {
          // 重新应用完整数据集
          this.chart.applyNewData(clonedData);
          
          // 计算合适的显示范围
          const dataLength = clonedData.length;
          if (dataLength > 0) {
            const visibleCount = Math.min(50, dataLength);
            const startIndex = Math.max(0, dataLength - visibleCount);
            const endIndex = dataLength - 1;
            
            // 设置视图范围
            if (this.chart.timeScaleController && typeof this.chart.timeScaleController().zoom === 'function') {
              this.chart.timeScaleController().zoom(startIndex, endIndex);
            }
          }
          
          // 强制重新渲染
          this.chart.render();
          
          console.log('图表强制更新成功');
        }, 50);
      } catch (error) {
        console.error('强制更新图表错误:', error);
      }
    },
    
    // 更新图表
    updateChart() {
      if (!this.chart || !this.chartData || this.chartData.length === 0) {
        console.warn('无法更新图表：图表未初始化或数据为空');
        return;
      }
      
      try {
        console.log('更新图表数据，数据点数量:', this.chartData.length);
        
        // 清除所有数据
        this.chart.clearData();
        
        // 应用新数据 - 数据已经在前面的方法中转换为正确格式
        this.chart.applyNewData(this.chartData);
        
        // 关键步骤1：设置合适的时间区间，确保图表自动显示
        // 计算合适的起始和结束索引
        const dataLength = this.chartData.length;
        // 只显示最近一部分数据（比如最近50条），避免图表过于拥挤
        const startIndex = Math.max(0, dataLength - 50);
        const endIndex = dataLength - 1;
        
        // 关键步骤2：延迟执行确保数据已经被处理
        setTimeout(() => {
          // 设置图表时间范围以显示最近的数据
          if (this.chart.timeScaleController && typeof this.chart.timeScaleController().zoom === 'function') {
            this.chart.timeScaleController().zoom(startIndex, endIndex);
          }
          
          // 关键步骤3：强制图表刷新
          this.chart.render();
          
          console.log('图表数据更新成功，并已设置显示范围');
        }, 50);
      } catch (error) {
        console.error('更新图表数据错误:', error);
        this.$ownerInstance.callMethod('handleMessage', {
          detail: { type: 'chartError', error: error.message }
        });
      }
    },

    // 更新最后一个蜡烛图数据
    updateLastCandle(candleStr) {
      if (!this.chart) {
        console.warn('无法更新数据：图表未初始化');
        return;
      }
      
      try {
        const candle = JSON.parse(candleStr);
        console.log('更新最后一个K线数据:', candle);
        
        // 验证和修复时间戳
        if (typeof candle.time === 'string') {
          candle.time = Number(candle.time);
        } else if (candle.time instanceof Date) {
          candle.time = Math.floor(candle.time.getTime() / 1000);
        }
        
        if (isNaN(candle.time) || !isFinite(candle.time)) {
          throw new Error(`无效的时间戳: ${candle.time}`);
        }
        
        // 根据 KLineChart 文档，使用 updateData 方法更新最后一条数据
        if (this.chartData.length > 0) {
          // 根据时间戳找到对应的数据索引
          const dataIndex = this.chartData.findIndex(item => item.time === candle.time);
          
          if (dataIndex >= 0) {
            // 更新本地数据
            this.chartData[dataIndex] = candle;
            
            // 更新图表数据
            this.chart.updateData(candle);
            console.log('成功更新最后一条K线数据');
          } else {
            console.warn('未找到匹配的K线数据进行更新');
            // 如果找不到匹配的数据，可能需要添加新数据
            this.appendNewCandle(candleStr);
          }
        }
        
        // 强制重新渲染
        this.chart.render();
      } catch (error) {
        console.error('更新最后一个K线数据错误:', error);
      }
    },

    // 添加一个新的蜡烛图数据
    appendNewCandle(candleStr) {
      if (!this.chart) {
        console.warn('无法添加数据：图表未初始化');
        return;
      }
      
      try {
        const candle = JSON.parse(candleStr);
        console.log('添加新的K线数据:', candle);
        
        // 检查是否已存在相同时间的数据
        const existingIndex = this.chartData.findIndex(item => item.time === candle.time);
        
        if (existingIndex >= 0) {
          // 如果已存在相同时间的数据，则更新它
          this.chartData[existingIndex] = candle;
          this.chart.updateData(candle);
          console.log('更新已存在的K线数据');
        } else {
          // 添加到本地数据
          this.chartData.push(candle);
          
          // 使用 addData 方法添加新数据
          this.chart.addData(candle);
          console.log('添加新的K线数据成功');
          
          // 如果数据超过了一定数量，可以考虑移除最旧的数据
          const maxDataPoints = 1000; // 最大数据点数量，可以根据需要调整
          if (this.chartData.length > maxDataPoints) {
            this.chartData.shift(); // 移除最旧的数据
          }
        }
        
        // 滚动到最新数据
        const dataLength = this.chartData.length;
        if (dataLength > 0) {
          // 设置视图显示最新数据
          const visibleCount = 50; // 可见的蜡烛图数量
          const startIndex = Math.max(0, dataLength - visibleCount);
          const endIndex = dataLength - 1;
          
          // 只有在需要时才调整视图范围
          if (this.chart.timeScaleController && typeof this.chart.timeScaleController().zoom === 'function') {
            this.chart.timeScaleController().zoom(startIndex, endIndex);
          }
        }
        
        // 强制重新渲染
        this.chart.render();
      } catch (error) {
        console.error('添加新的K线数据错误:', error);
      }
    },

    // 初始化图表
    initChart() {
      try {
        console.log('初始化图表...');
        // 先清理已存在的实例
        const canvasElement = document.getElementById('kline-chart');
        console.log('获取canvas元素:', canvasElement ? '成功' : '失败');
        
        if (canvasElement) {
          console.log('清理图表');
          dispose('kline-chart');
        }

        // 设置图表初始化配置
        canvasElement.width = canvasElement.clientWidth;
        canvasElement.height = canvasElement.clientHeight || 450;

        // 初始化 K 线图
        const chart = init('kline-chart', {
          style: config,
          layout: [
            {
              type: 'candle',
              content: [{ name: 'EMA', calcParams: [3, 7, 21] }],
              options: { order: Number.MIN_SAFE_INTEGER }
            },
            { type: 'indicator', content: ['VOL'], options: { order: 10 }  },
            { type: 'xAxis', options: { order: 9 } }
          ],
          // 添加 yAxis 配置，设置自动适配价格范围
          // yAxis: {
          //   autoCalcTickInterval: true,  // 自动计算刻度间隔
          //   autoFit: true,              // 自动适应数据范围
          //   minSpringbackRate: 0.2      // 弹回率，控制边界距离
          // },
          // // 添加时间轴配置
          // timeAxis: {
          //   visibleBarCount: 50,
          //   scrollToPosition: 'last', // 始终滚动到最后一个蜡烛图
          //   realTime: true // 启用实时模式
          // },
          // // 添加交互配置
          // interactions: [
          //   { key: 'panning' },
          //   { key: 'zoomX' }
          // ]
        });

        if (!chart) {
          throw new Error('初始化图表失败');
        }

        this.chart = chart;

        // 初始加载数据
        if (this.chartData && this.chartData.length > 0) {
          this.updateChart();
        } else {
          console.log('初始化时没有数据可加载');
        }

        // 通知 Vue 组件图表已创建
        this.$ownerInstance.callMethod('handleMessage', {
          detail: { type: 'chartCreated' }
        });
      } catch (error) {
        console.error('初始化图表错误:', error);
        this.$ownerInstance.callMethod('handleMessage', {
          detail: { type: 'chartError', error: error.message }
        });
      }
    },
    
    // 设置尺寸变化处理
    setupResizeHandler() {
      try {
        // 使用 ResizeObserver 而不是 window 事件
        if (typeof ResizeObserver !== 'undefined') {
          const chartElement = document.getElementById('kline-chart');
          if (chartElement) {
            this.resizeObserver = new ResizeObserver(this.handleResize);
            this.resizeObserver.observe(chartElement);
            console.log('ResizeObserver 已设置');
          } else {
            console.warn('找不到图表元素，无法设置 ResizeObserver');
          }
        } else {
          console.warn('ResizeObserver 在当前环境不可用');
          
          // 备选方案: 使用setInterval定期检查尺寸变化
          this.setupIntervalResize();
        }
      } catch (error) {
        console.error('设置尺寸变化处理错误:', error);
        
        // 出错时也使用备选方案
        this.setupIntervalResize();
      }
    },
    // 备选方案：使用定时器检查尺寸变化
    setupIntervalResize() {
      const chartElement = document.getElementById('kline-chart');
      if (!chartElement) return;
      
      let lastWidth = chartElement.clientWidth;
      let lastHeight = chartElement.clientHeight;
      
      // 每秒检查一次尺寸变化
      this.resizeInterval = setInterval(() => {
        const currentWidth = chartElement.clientWidth;
        const currentHeight = chartElement.clientHeight;
        
        if (currentWidth !== lastWidth || currentHeight !== lastHeight) {
          lastWidth = currentWidth;
          lastHeight = currentHeight;
          this.handleResize();
        }
      }, 1000);
      
      console.log('尺寸变化检测定时器已设置');
    },
    // 处理尺寸调整
    handleResize() {
      console.log('检测到尺寸变化，重新调整图表大小');
      if (this.chart) {
        this.chart.resize();
      }
    },
    // 清理资源的方法
    cleanupResources() {
      // 清理图表实例
      if (this.chart) {
        dispose('kline-chart');
        this.chart = null;
      }
      
      // 清理ResizeObserver
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }
      
      // 清理定时器
      if (this.resizeInterval) {
        clearInterval(this.resizeInterval);
        this.resizeInterval = null;
      }
    }
  },
  
  // 组件销毁前清理资源
  beforeDestroy() {
    this.cleanupResources();
  },
  
  // 在Vue3中使用beforeUnmount，兼容处理
  beforeUnmount() {
    this.cleanupResources();
  },
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  position: relative;
  overflow: hidden;
}

.kline-chart {
  width: 100%;
  height: 500px;
}
</style>