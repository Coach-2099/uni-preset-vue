<template>
  <view class="chart-container">
    <!-- 关键点：在这里绑定数据和监听函数 -->
    <canvas
      type="2d"
      id="kline-chart"
      class="kline-chart"
      :style="{ width: '100%', height: '500px' }"
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

// 暴露方法供 renderjs 调用
defineExpose({
  handleMessage
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
        const parsedData = JSON.parse(newValue);
        console.log('数据解析成功，数据点数量:', parsedData.length);
        this.chartData = parsedData;
        
        // 更新图表
        this.updateChart();
      } catch (error) {
        console.error('处理数据变化错误:', error);
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
        
        // 应用新数据
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
          this.chart.timeScaleController().zoom(startIndex, endIndex);
          
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
        // 注：根据KLineCharts 10.x的文档，组件默认宽度是100%但高度是默认固定的
        // 确保canvas元素有明确的宽高设置
        canvasElement.width = canvasElement.clientWidth;
        canvasElement.height = canvasElement.clientHeight || 500;

        // 初始化 K 线图
        const chart = init('kline-chart', {
          layout: [
            {
              type: 'candle',
              content: ['MA', { name: 'EMA', calcParams: [10, 30] }],
              options: { order: Number.MIN_SAFE_INTEGER }
            },
            { type: 'indicator', content: ['VOL'], options: { order: 10 }  },
            { type: 'xAxis', options: { order: 9 } }
          ]
        });

        if (!chart) {
          throw new Error('初始化图表失败');
        }

        this.chart = chart;
        
        // 设置图表加载完成事件
        chart.subscribeAction('onLoadMore', () => {
          console.log('图表加载更多数据...');
        });

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