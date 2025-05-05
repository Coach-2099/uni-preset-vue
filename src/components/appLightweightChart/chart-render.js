/**
 * lightweight-charts renderjs 实现
 * 此文件需要放在与 index.vue 同级目录下
 */
import {
  createChart,
  CandlestickSeries,
  LineSeries,
  HistogramSeries
} from 'lightweight-charts';

const ChartRenderer = {
  data() {
    return {
      chart: null,
      candleSeries: null,
      volumeSeries: null,
      emaSeriesMap: new Map(),
      toolTip: null,
      candleData: [],
      emaConfigs: [],
      theme: 'light',
      selectedInterval: 60,
      chartId: '',
      hasMore: false,
      earliestDataTime: 0
    }
  },
  
  mounted() {
    // 获取参数
    this.theme = this.$attrs.theme || 'light';
    this.selectedInterval = parseInt(this.$attrs.selectedInterval || 60);
    this.chartId = this.$attrs.chartId || '';
    
    // 监听来自 Vue 组件的消息
    uni.$on(`chart_message_${this.chartId}`, this.handleVueMessage);
    
    // 初始化图表
    this.$nextTick(() => {
      this.initChart();
    });
  },
  
  beforeDestroy() {
    // 注销消息监听
    uni.$off(`chart_message_${this.chartId}`);
    
    // 销毁图表实例
    this.destroyChart();
  },
  
  methods: {
    // 初始化图表
    initChart() {
      const container = this.$el;
      if (!container) return;
      
      try {
        // 创建提示框元素
        this.createTooltip(container);
        
        // 创建图表实例
        this.chart = createChart(container, {
          width: container.clientWidth,
          height: 400,
          layout: { 
            background: {
              color: this.theme === 'dark' ? '#1E1E1E' : '#FFFFFF'
            },
            textColor: this.theme === 'dark' ? '#DDD' : '#333'
          },
          rightPriceScale: { 
            scaleMargins: { top: 0.3, bottom: 0.25 },
            borderVisible: false,
            autoScale: true,
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
              color: this.theme === 'dark' ? '#FFFFFF22' : '#00000022',
              style: 2,
              visible: true
            },
            horzLines: {
              color: this.theme === 'dark' ? '#FFFFFF22' : '#00000022',
              style: 2,
              visible: true
            }
          },
          timeScale: {
            timeVisible: true,
            secondsVisible: this.selectedInterval <= 60,
            borderVisible: false
          }
        });
        
        // 添加蜡烛图系列
        this.candleSeries = this.chart.addSeries(CandlestickSeries, {
          upColor: '#26a69a',
          downColor: '#ef5350',
          borderVisible: false,
          wickUpColor: '#26a69a',
          wickDownColor: '#ef5350',
          priceFormat: {
            type: 'price',
            minMove: 0.00000001,
            precision: 8
          }
        });
        
        // 添加成交量系列
        this.volumeSeries = this.chart.addSeries(HistogramSeries, {
          color: '#26a69a',
          priceFormat: { type: 'volume' },
          priceScaleId: 'volume'
        });
        
        // 配置成交量系列
        const priceScale = this.chart.priceScale('volume');
        priceScale.applyOptions({
          visible: false,
          scaleMargins: {
            top: 0.85,
            bottom: 0
          }
        });
        
        // 添加十字光标移动事件
        this.setupCrosshairMove();
        
        // 添加可见时间范围变化事件
        this.setupTimeRangeChange();
        
        // 处理窗口大小变化
        window.addEventListener('resize', this.handleResize);
        
        // 通知 Vue 组件图表已准备好
        this.sendMessageToVue({
          type: 'chartReady'
        });
        
      } catch (error) {
        console.error('图表初始化错误:', error);
        this.sendMessageToVue({
          type: 'chartError',
          data: error.message
        });
      }
    },
    
    // 创建提示框
    createTooltip(container) {
      const toolTipEl = document.createElement('div');
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
      `;
      container.appendChild(toolTipEl);
      this.toolTip = toolTipEl;
    },
    
    // 设置十字光标移动事件
    setupCrosshairMove() {
      if (!this.chart || !this.toolTip) return;
      
      this.chart.subscribeCrosshairMove(param => {
        if (!param.point || !param.time || !this.candleSeries) {
          this.toolTip.style.display = 'none';
          return;
        }
        
        const candleData = param.seriesData?.get(this.candleSeries);
        if (!candleData) {
          this.toolTip.style.display = 'none';
          return;
        }
        
        // 获取EMA系列数据
        const emaValues = Array.from(this.emaSeriesMap.entries()).map(([period, series]) => {
          const data = param.seriesData?.get(series);
          return {
            period,
            value: data?.value
          };
        });
        
        const { close, open, high, low } = candleData;
        const change = close && open ? ((close - open) / open * 100).toFixed(2) : '0.00';
        
        // 更新提示框内容
        this.toolTip.innerHTML = `
          <div class="${this.theme === 'dark' ? 'text-white' : 'text-gray'}">
            ${new Date(param.time * 1000).toLocaleString()}
          </div>
          <div style="display: flex; justify-content: space-between; color: #888;">
            <div>收盘:</div><div>${close}</div>
          </div>
          <div style="display: flex; justify-content: space-between; color: #888;">
            <div>开盘:</div><div>${open}</div>
          </div>
          <div style="display: flex; justify-content: space-between; color: #888;">
            <div>最高:</div><div>${high}</div>
          </div>
          <div style="display: flex; justify-content: space-between; color: #888;">
            <div>最低:</div><div>${low}</div>
          </div>
          <div style="display: flex; justify-content: space-between; color: #888;">
            <div>涨跌:</div>
            <div style="color: ${change > 0 ? '#26a69a' : '#ef5350'}">${change}%</div>
          </div>
        `;
        
        // 更新提示框位置
        const { x, y } = param.point;
        const containerWidth = this.$el.clientWidth;
        const containerHeight = this.$el.clientHeight;
        const tooltipWidth = this.toolTip.offsetWidth;
        const tooltipHeight = this.toolTip.offsetHeight;
        
        let left = x + 15;
        let top = y + 15;
        if (left > containerWidth - tooltipWidth) left = x - tooltipWidth - 15;
        if (top > containerHeight - tooltipHeight) top = y - tooltipHeight - 15;
        
        Object.assign(this.toolTip.style, {
          left: `${left}px`,
          top: `${top}px`,
          display: 'block',
          background: this.theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
          borderColor: this.theme === 'dark' ? '#666' : '#DDD'
        });
      });
    },
    
    // 设置时间范围变化事件
    setupTimeRangeChange() {
      if (!this.chart) return;
      
      this.chart.timeScale().subscribeVisibleTimeRangeChange(newRange => {
        if (!newRange?.from || !this.hasMore) return;
        
        // 获取当前数据的最早时间戳
        const earliestDataTime = this.candleData[0]?.time;
        if (!earliestDataTime) return;
        
        // 当可见范围开始时间接近数据集头部时触发加载
        if (newRange.from <= earliestDataTime && this.earliestDataTime !== earliestDataTime) {
          this.earliestDataTime = earliestDataTime;
          
          // 通知 Vue 组件加载更多数据
          this.sendMessageToVue({
            type: 'loadMore',
            data: {
              start: earliestDataTime,
              end: newRange.to
            }
          });
        }
      });
    },
    
    // 初始化 EMA 系列
    initEMASeries() {
      if (!this.chart) return;
      
      // 清理现有的 EMA 系列
      this.emaSeriesMap.forEach((series) => {
        this.chart.removeSeries(series);
      });
      this.emaSeriesMap.clear();
      
      // 添加新的 EMA 系列
      this.emaConfigs.forEach(config => {
        const series = this.chart.addSeries(LineSeries, {
          color: config.color,
          lineWidth: config.lineWidth || 2,
          lineStyle: 0,
          priceScaleId: 'none',
          lastValueVisible: false,
          visible: config.visible !== false,
          title: `EMA ${config.period}`
        });
        
        this.emaSeriesMap.set(config.period, series);
      });
      
      // 更新 EMA 数据
      this.updateAllEMAData();
    },
    
    // 计算 EMA 数据
    calculateEMA(period) {
      if (!this.candleData || this.candleData.length === 0) return [];
      
      const minDataPoints = Math.min(period, this.candleData.length);
      const k = 2 / (period + 1);
      const emaData = [];
      let ema = this.candleData[0].close;
      
      for (let i = 0; i < this.candleData.length; i++) {
        if (i < minDataPoints - 1) {
          // 数据不足时使用 SMA
          const closes = this.candleData.slice(0, i + 1).map(d => d.close);
          ema = closes.reduce((a, b) => a + b, 0) / closes.length;
        } else {
          ema = (this.candleData[i].close - ema) * k + ema;
        }
        
        emaData.push({
          time: this.candleData[i].time,
          value: Number(ema)
        });
      }
      
      return emaData;
    },
    
    // 更新所有 EMA 数据
    updateAllEMAData() {
      this.emaConfigs.forEach(config => {
        const series = this.emaSeriesMap.get(config.period);
        if (!series) return;
        
        const emaData = this.calculateEMA(config.period);
        series.setData(emaData);
      });
      
      // 更新 EMA 值并通知 Vue 组件
      this.updateEMAValues();
    },
    
    // 更新 EMA 值
    updateEMAValues() {
      const emaValues = Array.from(this.emaSeriesMap.entries()).map(([period, series]) => {
        const data = series.data();
        const lastData = data[data.length - 1];
        const config = this.emaConfigs.find(c => c.period === period);
        
        return {
          period,
          value: lastData?.value,
          color: config?.color,
          visible: series.options().visible
        };
      }).filter(Boolean);
      
      this.sendMessageToVue({
        type: 'emaUpdate',
        data: emaValues
      });
    },
    
    // 更新最后一根蜡烛
    updateLastCandle(candle) {
      if (!this.candleSeries || !candle) return;
      
      this.candleSeries.update(candle);
      
      // 更新成交量数据
      if (this.volumeSeries) {
        this.volumeSeries.update({
          time: candle.time,
          value: candle.volume,
          color: candle.close > candle.open ? '#26a69a' : '#ef5350'
        });
      }
      
      // 更新最后一根蜡烛的 EMA 值
      this.updateEMAForLastCandle(candle);
      
      // 更新本地数据
      const lastIndex = this.candleData.findIndex(item => item.time === candle.time);
      if (lastIndex !== -1) {
        this.candleData[lastIndex] = candle;
      }
      
      // 更新 EMA 值
      this.updateEMAValues();
    },
    
    // 追加新蜡烛
    appendNewCandle(candle) {
      if (!this.candleSeries || !candle) return;
      
      this.candleSeries.update(candle);
      
      // 更新成交量数据
      if (this.volumeSeries) {
        this.volumeSeries.update({
          time: candle.time,
          value: candle.volume,
          color: candle.close > candle.open ? '#26a69a' : '#ef5350'
        });
      }
      
      // 更新 EMA 数据
      this.updateEMAIncrementally([candle]);
      
      // 添加到本地数据
      this.candleData.push(candle);
      
      // 更新 EMA 值
      this.updateEMAValues();
    },
    
    // 更新最后蜡烛的 EMA 值
    updateEMAForLastCandle(candle) {
      this.emaConfigs.forEach(config => {
        const series = this.emaSeriesMap.get(config.period);
        if (!series) return;
        
        // 获取当前 EMA 数据最后值
        const currentData = series.data();
        const lastEma = currentData[currentData.length - 1]?.value;
        
        if (lastEma) {
          const k = 2 / (config.period + 1);
          const newEma = (candle.close - lastEma) * k + lastEma;
          
          series.update({
            time: candle.time,
            value: Number(newEma)
          });
        }
      });
    },
    
    // 增量更新 EMA 数据
    updateEMAIncrementally(newCandles) {
      this.emaConfigs.forEach(config => {
        const series = this.emaSeriesMap.get(config.period);
        if (!series) return;
        
        const existingData = series.data();
        const lastEma = existingData[existingData.length - 1]?.value || 0;
        const k = 2 / (config.period + 1);
        
        // 处理每个新蜡烛图
        newCandles.forEach((candle, index) => {
          // 当已有数据不足时重新计算EMA
          if (existingData.length + index < config.period - 1) {
            const closes = this.candleData
              .slice(0, existingData.length + index + 1)
              .map(d => d.close);
            const sma = closes.reduce((a, b) => a + b, 0) / closes.length;
            series.update({ time: candle.time, value: sma });
          } else {
            const prevEma = index === 0 ? lastEma : existingData[existingData.length + index - 1]?.value;
            const newEma = (candle.close - prevEma) * k + prevEma;
            series.update({
              time: candle.time,
              value: Number(newEma.toFixed(4))
            });
          }
        });
      });
    },
    
    // 设置数据
    setChartData(data) {
      if (!this.chart || !this.candleSeries) return;
      
      // 保存数据到本地
      this.candleData = data;
      this.hasMore = this.hasMore || false;
      
      // 验证数据顺序
      this.validateData();
      
      // 动态设置价格精度
      if (data.length > 0) {
        this.setPricePrecision();
      }
      
      // 设置蜡烛图数据
      this.candleSeries.setData(data);
      
      // 设置成交量数据
      this.resetVolumeSeries();
      
      // 更新 EMA 数据
      this.initEMASeries();
      
      // 调整可视范围
      this.chart.timeScale().fitContent();
      this.chart.timeScale().setVisibleLogicalRange({
        from: Math.max(0, data.length - 30),
        to: data.length - 1
      });
    },
    
    // 验证数据
    validateData() {
      if (!this.candleData || this.candleData.length <= 1) return;
      
      // 检查时间序列是否有序
      for (let i = 1; i < this.candleData.length; i++) {
        if (this.candleData[i].time <= this.candleData[i - 1].time) {
          console.error(`数据顺序错误: index=${i}, time=${this.candleData[i].time}, prev=${this.candleData[i - 1].time}`);
        }
      }
    },
    
    // 设置价格精度
    setPricePrecision() {
      // 计算最大小数位数
      const maxDecimals = this.candleData.reduce((max, d) => {
        const priceStr = d.close.toString();
        const decimalIndex = priceStr.indexOf('.');
        return decimalIndex === -1 ? 0 : Math.max(max, priceStr.length - decimalIndex - 1);
      }, 0);
      
      const precision = Math.min(maxDecimals, 8);
      
      // 更新蜡烛图系列的价格格式
      this.candleSeries.applyOptions({
        priceFormat: {
          type: 'price',
          precision,
          minMove: Math.pow(10, -precision)
        }
      });
    },
    
    // 重置成交量系列
    resetVolumeSeries() {
      if (!this.volumeSeries || !this.candleData.length) return;
      
      const volumeData = this.candleData.map(d => ({
        time: d.time,
        value: d.volume,
        color: d.close > d.open ? '#26a69a' : '#ef5350'
      }));
      
      this.volumeSeries.setData(volumeData);
    },
    
    // 清空数据
    clearData() {
      if (!this.chart) return;
      
      // 清空蜡烛图数据
      if (this.candleSeries) {
        this.candleSeries.setData([]);
      }
      
      // 清空成交量数据
      if (this.volumeSeries) {
        this.volumeSeries.setData([]);
      }
      
      // 清空EMA数据
      this.emaSeriesMap.forEach(series => {
        series.setData([]);
      });
      
      // 清空本地数据
      this.candleData = [];
    },
    
    // 更新主题
    setTheme(theme) {
      this.theme = theme;
      
      if (!this.chart) return;
      
      // 更新图表主题
      this.chart.applyOptions({
        layout: {
          background: {
            color: theme === 'dark' ? '#1E1E1E' : '#FFFFFF'
          },
          textColor: theme === 'dark' ? '#DDD' : '#333'
        },
        grid: {
          vertLines: {
            color: theme === 'dark' ? '#FFFFFF22' : '#00000022'
          },
          horzLines: {
            color: theme === 'dark' ? '#FFFFFF22' : '#00000022'
          }
        }
      });
    },
    
    // 处理窗口大小变化
    handleResize() {
      if (!this.chart || !this.$el) return;
      
      const { clientWidth } = this.$el;
      this.chart.applyOptions({ width: clientWidth });
    },
    
    // 处理来自 Vue 组件的消息
    handleVueMessage(message) {
      console.log('收到 Vue 消息:', message);
      
      switch (message.type) {
        case 'setData':
          this.emaConfigs = message.data.emaConfigs || [];
          this.hasMore = message.data.hasMore;
          this.setChartData(message.data.candleData);
          break;
          
        case 'updateLastCandle':
          this.updateLastCandle(message.data);
          break;
          
        case 'appendNewCandle':
          this.appendNewCandle(message.data);
          break;
          
        case 'clearData':
          this.clearData();
          break;
          
        case 'setTheme':
          this.setTheme(message.data);
          break;
          
        case 'updateEMAConfigs':
          this.emaConfigs = message.data;
          this.initEMASeries();
          break;
          
        case 'changeInterval':
          this.selectedInterval = message.data.interval;
          // 更新时间格式
          this.updateTimeFormatter();
          break;
      }
    },
    
    // 更新时间格式
    updateTimeFormatter() {
      if (!this.chart) return;
      
      const formatTime = (timestamp) => {
        const date = new Date(timestamp * 1000);
        
        if (this.selectedInterval <= 60) {
          // 分钟
          return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        } else if (this.selectedInterval <= 3600) {
          // 小时
          return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        } else if (this.selectedInterval <= 86400) {
          // 天
          return `${date.getMonth()+1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}时`;
        } else {
          // 周或更长
          return `${date.getMonth()+1}/${date.getDate()}`;
        }
      };
      
      this.chart.applyOptions({
        timeScale: {
          timeVisible: true,
          secondsVisible: this.selectedInterval <= 60,
          tickMarkFormatter: formatTime
        }
      });
    },
    
    // 销毁图表
    destroyChart() {
      // 移除窗口大小变化事件监听
      window.removeEventListener('resize', this.handleResize);
      
      // 清理tooltip元素
      if (this.toolTip && this.toolTip.parentNode) {
        this.toolTip.parentNode.removeChild(this.toolTip);
        this.toolTip = null;
      }
      
      // 销毁图表
      if (this.chart) {
        this.chart.remove();
        this.chart = null;
      }
      
      // 清空其他引用
      this.candleSeries = null;
      this.volumeSeries = null;
      this.emaSeriesMap.clear();
    },
    
    // 发送消息到 Vue 组件
    sendMessageToVue(message) {
      // 向 Vue 组件发送消息
      uni.postMessage({
        data: message
      });
    }
  }
};

export default {
  name: 'ChartRenderer',
  props: {
    chartId: String,
    theme: String,
    selectedInterval: Number
  },
  // 在 renderjs 中渲染
  render: h => h('div', {
    attrs: {
      id: 'chart-container',
      style: 'width: 100%; height: 400px;'
    }
  }),
  // 挂载 renderjs
  mixins: [ChartRenderer]
};