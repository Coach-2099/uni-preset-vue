<template>
  <!-- 
   id: id值
   :newest : 最新值
   :history : 历史数据
   :change:newest : 监听最新值是否变化 (renderScript 对应下边 script 标签上的 module="renderScript")
   :change:history : 监听历史数据是否变化 (renderScript 对应下边 script 标签上的 module="renderScript")
  -->
  <div class="app-chart">
    <view
      id="chart"
      :newest="klineNewest"
      :history="klineHistory"
      :change:newest="renderScript.updateNewest"
      :change:history="renderScript.updateHistory"
      :style="{ height: '450px' }"
    >
    </view>
  </div>
</template>
 
 <script setup>
import { onMounted, ref, nextTick } from 'vue'
import { init } from 'klinecharts'

// 历史
const klineHistory = ref([])
// 最新（使用带时间戳的响应式）
const klineNewest = ref([])
const myConfig = config

// 获取kline 历史数据
const getKlineHistory = () => {
  nextTick(() => {
    console.log('数据！！！！！')
    //http请求 略
    klineHistory.value = [
      { close: 4976.16, high: 4977.99, low: 4970.12, open: 4972.89, timestamp: 1587660000000, volume: 204 },
      { close: 4977.33, high: 4979.94, low: 4971.34, open: 4973.20, timestamp: 1587660060000, volume: 194 },
      { close: 4977.93, high: 4977.93, low: 4974.20, open: 4976.53, timestamp: 1587660120000, volume: 197 },
      { close: 4966.77, high: 4968.53, low: 4962.20, open: 4963.88, timestamp: 1587660180000, volume: 28 },
      { close: 4961.56, high: 4972.61, low: 4961.28, open: 4961.28, timestamp: 1587660240000, volume: 184 },
      { close: 4964.19, high: 4964.74, low: 4961.42, open: 4961.64, timestamp: 1587660300000, volume: 191 },
      { close: 4968.93, high: 4972.70, low: 4964.55, open: 4966.96, timestamp: 1587660360000, volume: 105 },
      { close: 4979.31, high: 4979.61, low: 4973.99, open: 4977.06, timestamp: 1587660420000, volume: 35 },
      { close: 4977.02, high: 4981.66, low: 4975.14, open: 4981.66, timestamp: 1587660480000, volume: 135 },
      { close: 4985.09, high: 4988.62, low: 4980.30, open: 4986.72, timestamp: 1587660540000, volume: 76 }
    ]
  })

}
// 获取kline 最新数据 (webscoket)
const webscoketKline = () => {
  //scoket请求 略
  // klineNewest.value = data
}
onMounted(() => {
  console.log('组件挂载')
  getKlineHistory()
})
</script>


 <!-- script  setup 不支持 lang="renderjs" 后也不支持uni-app 的各种方法(uni.xxx) -->
<script module="renderScript" lang="renderjs">
import { config } from './klineConfig.js'
import { init, dispose, registerIndicator, registerStyles } from 'klinecharts' // 修改导入方式
var kline
export default {
  mounted() {
    console.log('RenderJS 初始化')
    this.initChart()
  },
  // 不能使用 created 周期
  methods: {
    initChart() {
      const styles = {
        grid: {
          show: true,
          horizontal: {
            show: true,
            size: 1,
            color: '#EDEDED',
            style: 'dashed',
            dashedValue: [2, 2]
          },
          vertical: {
            show: true,
            size: 1,
            color: '#EDEDED',
            style: 'dashed',
            dashedValue: [2, 2]
          }
        },
        candle: {
          // 'candle_solid' | 'candle_stroke' | 'candle_up_stroke' | 'candle_down_stroke' | 'ohlc' | 'area'
          type: 'candle_solid',
          bar: {
            // 'current_open' | 'previous_close'
            compareRule: 'current_open',
            upColor: '#2DC08E',
            downColor: '#F92855',
            noChangeColor: '#888888',
            upBorderColor: '#2DC08E',
            downBorderColor: '#F92855',
            noChangeBorderColor: '#888888',
            upWickColor: '#2DC08E',
            downWickColor: '#F92855',
            noChangeWickColor: '#888888'
          },
          area: {
            lineSize: 2,
            lineColor: '#2196F3',
            smooth: false,
            value: 'close',
            backgroundColor: [{
              offset: 0,
              color: 'rgba(33, 150, 243, 0.01)'
            }, {
              offset: 1,
              color: 'rgba(33, 150, 243, 0.2)'
            }],
            point: {
              show: true,
              color: '#1677FF',
              radius: 4,
              // rippleColor: getAlphaBlue(0.3),
              rippleRadius: 8,
              animation: true,
              animationDuration: 1000
            }
          },
          priceMark: {
            show: true,
            high: {
              show: true,
              color: '#D9D9D9',
              textMargin: 5,
              textSize: 10,
              textFamily: 'Helvetica Neue',
              textWeight: 'normal'
            },
            low: {
              show: true,
              color: '#D9D9D9',
              textMargin: 5,
              textSize: 10,
              textFamily: 'Helvetica Neue',
              textWeight: 'normal',
            },
            last: {
              show: true,
              // 'current_open' | 'previous_close'
              compareRule: 'current_open',
              upColor: '#2DC08E',
              downColor: '#F92855',
              noChangeColor: '#888888',
              line: {
                show: true,
                // 'solid' | 'dashed'
                style: 'dashed',
                dashedValue: [4, 4],
                size: 1
              },
              text: {
                show: true,
                // 'fill' | 'stroke' | 'stroke_fill'
                style: 'fill',
                size: 12,
                paddingLeft: 4,
                paddingTop: 4,
                paddingRight: 4,
                paddingBottom: 4,
                // 'solid' | 'dashed'
                borderStyle: 'solid',
                borderSize: 0,
                borderColor: 'transparent',
                borderDashedValue: [2, 2],
                color: '#FFFFFF',
                family: 'Helvetica Neue',
                weight: 'normal',
                borderRadius: 2
              }
            }
          },
          tooltip: {
            offsetLeft: 4,
            offsetTop: 6,
            offsetRight: 4,
            offsetBottom: 6,
            // 'always' | 'follow_cross' | 'none'
            showRule: 'always',
            // 'standard' | 'rect'
            showType: 'standard',
            custom: [
              { title: 'time', value: '{time}' },
              { title: 'open', value: '{open}' },
              { title: 'high', value: '{high}' },
              { title: 'low', value: '{low}' },
              { title: 'close', value: '{close}' },
              { title: 'volume', value: '{volume}' }
            ],
            defaultValue: 'n/a',
            rect: {
            // 'fixed' | 'pointer'
              position: 'fixed',
              paddingLeft: 4,
              paddingRight: 4,
              paddingTop: 4,
              paddingBottom: 4,
              offsetLeft: 4,
              offsetTop: 4,
              offsetRight: 4,
              offsetBottom: 4,
              borderRadius: 4,
              borderSize: 1,
              borderColor: '#f2f3f5',
              color: '#FEFEFE'
            },
            text: {
              size: 12,
              family: 'Helvetica Neue',
              weight: 'normal',
              color: '#D9D9D9',
              marginLeft: 8,
              marginTop: 4,
              marginRight: 8,
              marginBottom: 4
            },
            // e.g.
            // [{
            //    id: 'icon_id',
            //    position: 'left', // 'left', 'middle', 'right'
            //    marginLeft: 8,
            //    marginTop: 6,
            //    marginRight: 0,
            //    marginBottom: 0,
            //    paddingLeft: 1,
            //    paddingTop: 1,
            //    paddingRight: 1,
            //    paddingBottom: 1,
            //    size: 12,
            //    color: '#76808F',
            //    activeColor: '#76808F',
            //    backgroundColor: 'rgba(33, 150, 243, 0.2)',
            //    activeBackgroundColor: 'rgba(33, 150, 243, 0.4)',
            //    type: 'path', // 'path', 'iconFont'
            //    path: {
            //      style: 'stroke', // 'stroke', 'fill'
            //      path: 'M6.81029,6.02908L11.7878,1.02746C12.0193,0.79483,12.0193,0.445881,11.7878,0.213247C11.5563,-0.019386,11.209,-0.019386,10.9775,0.213247L6,5.21486L1.02251,0.174475C0.790997,-0.0581583,0.44373,-0.0581583,0.212219,0.174475C-0.0192925,0.407108,-0.0192925,0.756058,0.212219,0.988691L5.18971,6.02908L0.173633,11.0307C-0.0578778,11.2633,-0.0578778,11.6123,0.173633,11.8449C0.289389,11.9612,0.44373,12,0.598071,12C0.752411,12,0.906752,11.9612,1.02251,11.8449L6,6.8433L10.9775,11.8449C11.0932,11.9612,11.2476,12,11.4019,12C11.5563,12,11.7106,11.9612,11.8264,11.8449C12.0579,11.6123,12.0579,11.2633,11.8264,11.0307L6.81029,6.02908Z',
            //      lineWidth: 1,
            //    },
            //    iconFont: {
            //      content: '\ue900',
            //      family: 'iconfont'
            //    }
            // }]
            features: []
          }
        },
        indicator: {
          ohlc: {
            // 'current_open' | 'previous_close'
            compareRule: 'current_open',
            upColor: 'rgba(45, 192, 142, .7)',
            downColor: 'rgba(249, 40, 85, .7)',
            noChangeColor: '#888888'
          },
          bars: [{
            // 'fill' | 'stroke' | 'stroke_fill'
            style: 'fill',
            // 'solid' | 'dashed'
            borderStyle: 'solid',
            borderSize: 1,
            borderDashedValue: [2, 2],
            upColor: 'rgba(45, 192, 142, .7)',
            downColor: 'rgba(249, 40, 85, .7)',
            noChangeColor: '#888888'
          }],
          lines: [
            {
              // 'solid' | 'dashed'
              style: 'solid',
              smooth: false,
              size: 1,
              dashedValue: [2, 2],
              color: '#FF9600'
            }, {
              style: 'solid',
              smooth: false,
              size: 1,
              dashedValue: [2, 2],
              color: '#935EBD'
            }, {
              style: 'solid',
              smooth: false,
              size: 1,
              dashedValue: [2, 2],
              color: '#2196F3'
            }, {
              style: 'solid',
              smooth: false,
              size: 1,
              dashedValue: [2, 2],
              color: '#E11D74'
            }, {
              style: 'solid',
              smooth: false,
              size: 1,
              dashedValue: [2, 2],
              color: '#01C5C4'
            }
          ],
          circles: [{
            // 'fill' | 'stroke' | 'stroke_fill'
            style: 'fill',
            // 'solid' | 'dashed'
            borderStyle: 'solid',
            borderSize: 1,
            borderDashedValue: [2, 2],
            upColor: 'rgba(45, 192, 142, .7)',
            downColor: 'rgba(249, 40, 85, .7)',
            noChangeColor: '#888888'
          }],
          lastValueMark: {
            show: false,
            text: {
              show: false,
              // 'fill' | 'stroke' | 'stroke_fill'
              style: 'fill',
              color: '#FFFFFF',
              size: 12,
              family: 'Helvetica Neue',
              weight: 'normal',
              // 'solid' | 'dashed'
              borderStyle: 'solid',
              borderSize: 1,
              borderDashedValue: [2, 2],
              paddingLeft: 4,
              paddingTop: 4,
              paddingRight: 4,
              paddingBottom: 4,
              borderRadius: 2
            }
          },
          tooltip: {
            show: false,
            offsetLeft: 4,
            offsetTop: 6,
            offsetRight: 4,
            offsetBottom: 6,
            // 'always' | 'follow_cross' | 'none'
            showRule: 'always',
            // 'standard' | 'rect'
            showType: 'standard',
            showName: true,
            showParams: true,
            defaultValue: 'n/a',
            text: {
              size: 12,
              family: 'Helvetica Neue',
              weight: 'normal',
              color: '#D9D9D9',
              marginTop: 4,
              marginRight: 8,
              marginBottom: 4,
              marginLeft: 8
            },
            // e.g.
            // [{
            //    id: 'icon_id',
            //    position: 'left', // 'left', 'middle', 'right'
            //    marginLeft: 8,
            //    marginTop: 6,
            //    marginRight: 0,
            //    marginBottom: 0,
            //    paddingLeft: 1,
            //    paddingTop: 1,
            //    paddingRight: 1,
            //    paddingBottom: 1,
            //    size: 12,
            //    color: '#76808F',
            //    activeColor: '#76808F',
            //    backgroundColor: 'rgba(33, 150, 243, 0.2)',
            //    activeBackgroundColor: 'rgba(33, 150, 243, 0.4)',
            //    type: 'path', // 'path', 'iconFont'
            //    path: {
            //      style: 'stroke', // 'stroke', 'fill'
            //      path: 'M6.81029,6.02908L11.7878,1.02746C12.0193,0.79483,12.0193,0.445881,11.7878,0.213247C11.5563,-0.019386,11.209,-0.019386,10.9775,0.213247L6,5.21486L1.02251,0.174475C0.790997,-0.0581583,0.44373,-0.0581583,0.212219,0.174475C-0.0192925,0.407108,-0.0192925,0.756058,0.212219,0.988691L5.18971,6.02908L0.173633,11.0307C-0.0578778,11.2633,-0.0578778,11.6123,0.173633,11.8449C0.289389,11.9612,0.44373,12,0.598071,12C0.752411,12,0.906752,11.9612,1.02251,11.8449L6,6.8433L10.9775,11.8449C11.0932,11.9612,11.2476,12,11.4019,12C11.5563,12,11.7106,11.9612,11.8264,11.8449C12.0579,11.6123,12.0579,11.2633,11.8264,11.0307L6.81029,6.02908Z',
            //      lineWidth: 1,
            //    },
            //    iconFont: {
            //      content: '\ue900',
            //      family: 'iconfont'
            //    }
            // }]
            features: []
          }
        },
        xAxis: {
          show: true,
          size: 'auto',
          axisLine: {
            show: true,
            color: '#888888',
            size: 1
          },
          tickText: {
            show: true,
            color: '#D9D9D9',
            family: 'Helvetica Neue',
            weight: 'normal',
            size: 12,
            marginStart: 4,
            marginEnd: 4
          },
          tickLine: {
            show: true,
            size: 1,
            length: 3,
            color: '#888888'
          }
        },
        yAxis: {
          show: true,
          size: 'auto',
          // 'left' | 'right'
          position: 'right',
          // 'normal' | 'percentage' | 'log'
          type: 'normal',
          inside: false,
          reverse: false,
          axisLine: {
            show: true,
            color: '#888888',
            size: 1
          },
          tickText: {
            show: true,
            color: '#D9D9D9',
            family: 'Helvetica Neue',
            weight: 'normal',
            size: 12,
            marginStart: 4,
            marginEnd: 4
          },
          tickLine: {
            show: true,
            size: 1,
            length: 3,
            color: '#888888'
          }
        },
        separator: {
          size: 1,
          color: '#888888',
          fill: true,
          activeBackgroundColor: 'rgba(230, 230, 230, .15)'
        },
        crosshair: {
          show: true,
          horizontal: {
            show: true,
            line: {
              show: true,
              // 'solid' | 'dashed'
              style: 'dashed',
              dashedValue: [4, 2],
              size: 1,
              color: '#888888'
            },
            text: {
              show: true,
              // 'fill' | 'stroke' | 'stroke_fill'
              style: 'fill',
              color: '#FFFFFF',
              size: 12,
              family: 'Helvetica Neue',
              weight: 'normal',
              // 'solid' | 'dashed'
              borderStyle: 'solid',
              borderDashedValue: [2, 2],
              borderSize: 1,
              borderColor: '#686D76',
              borderRadius: 2,
              paddingLeft: 4,
              paddingRight: 4,
              paddingTop: 4,
              paddingBottom: 4,
              backgroundColor: '#686D76'
            }
          },
          vertical: {
            show: true,
            line: {
              show: true,
              // 'solid'|'dashed'
              style: 'dashed',
              dashedValue: [4, 2],
              size: 1,
              color: '#888888'
            },
            text: {
              show: true,
              // 'fill' | 'stroke' | 'stroke_fill'
              style: 'fill',
              color: '#FFFFFF',
              size: 12,
              family: 'Helvetica Neue',
              weight: 'normal',
              // 'solid' | 'dashed'
              borderStyle: 'solid',
              borderDashedValue: [2, 2],
              borderSize: 1,
              borderColor: '#686D76',
              borderRadius: 2,
              paddingLeft: 4,
              paddingRight: 4,
              paddingTop: 4,
              paddingBottom: 4,
              backgroundColor: '#686D76'
            }
          }
        },
        overlay: {
          point: {
            color: '#1677FF',
            borderColor: 'rgba(22, 119, 255, 0.35)',
            borderSize: 1,
            radius: 5,
            activeColor: '#1677FF',
            activeBorderColor: 'rgba(22, 119, 255, 0.35)',
            activeBorderSize: 3,
            activeRadius: 5
          },
          line: {
            // 'solid' | 'dashed'
            style: 'solid',
            smooth: false,
            color: '#1677FF',
            size: 1,
            dashedValue: [2, 2]
          },
          rect: {
            // 'fill' | 'stroke' | 'stroke_fill'
            style: 'fill',
            color: 'rgba(22, 119, 255, 0.25)',
            borderColor: '#1677FF',
            borderSize: 1,
            borderRadius: 0,
            // 'solid' | 'dashed'
            borderStyle: 'solid',
            borderDashedValue: [2, 2]
          },
          polygon: {
            // 'fill' | 'stroke' | 'stroke_fill'
            style: 'fill',
            color: '#1677FF',
            borderColor: '#1677FF',
            borderSize: 1,
            // 'solid' | 'dashed'
            borderStyle: 'solid',
            borderDashedValue: [2, 2]
          },
          circle: {
            // 'fill' | 'stroke' | 'stroke_fill'
            style: 'fill',
            color: 'rgba(22, 119, 255, 0.25)',
            borderColor: '#1677FF',
            borderSize: 1,
            // 'solid' | 'dashed'
            borderStyle: 'solid',
            borderDashedValue: [2, 2]
          },
          arc: {
            // 'solid' | 'dashed'
            style: 'solid',
            color: '#1677FF',
            size: 1,
            dashedValue: [2, 2]
          },
          text: {
            // 'fill' | 'stroke' | 'stroke_fill'
            style: 'fill',
            color: '#FFFFFF',
            size: 12,
            family: 'Helvetica Neue',
            weight: 'normal',
            // 'solid' | 'dashed'
            borderStyle: 'solid',
            borderDashedValue: [2, 2],
            borderSize: 0,
            borderRadius: 2,
            borderColor: '#1677FF',
            paddingLeft: 0,
            paddingRight: 0,
            paddingTop: 0,
            paddingBottom: 0,
            backgroundColor: '#1677FF'
          }
        }
      }

      registerIndicator({
        name: 'customIndicatorDraw',
        shortName: 'Volume',
        zLevel: -1,
        figures: [],
        calc: dataList => dataList.map(data => ({ volume: data.volume, close: data.close, open: data.open })),
        createTooltipDataSource: ({ indicator, crosshair }) => {
          const result = indicator.result;
          const data = result[crosshair.dataIndex];
          if (data) {
            const color = data.open < data.close ? 'rgb(224, 152, 199)' : 'rgb(143, 211, 232)';
            return {
              legends: [
                { title: '', value: { text: data.volume, color } },
              ]
            };
          }
          return {};
        },
        draw: ({ ctx, chart, indicator, bounding, xAxis }) => {
          const { realFrom, realTo } = chart.getVisibleRange();
          const { gapBar, halfGapBar } = chart.getBarSpace()
          const { result } = indicator;
          let maxVolume = 0;
          for (let i = realFrom; i < realTo; i++) {
            const data = result[i];
            if (data) {
              maxVolume = Math.max(maxVolume, data.volume);
            }
          }
          const totalHeight = bounding.height * 0.4;
          const Rect = getFigureClass('rect');
          for (let i = realFrom; i < realTo; i++) {
            const data = result[i];
            if (data) {
              const height = Math.round(data.volume / maxVolume * totalHeight);
              const color = data.open < data.close ? 'rgba(224, 152, 199, 0.6)' : 'rgba(143, 211, 232, 0.6)';
              new Rect({
                name: 'rect',
                attrs: {
                  x: xAxis.convertToPixel(i) - halfGapBar,
                  y: bounding.height - height,
                  width: gapBar,
                  height
                },
                styles: { color }
              }).draw(ctx);
            }
          }
          return true;
        }
      });

      // 设置样式
      registerStyles('customTheme',{
        candle: {
          bar: {
            upColor: '#2b821d',
            upBorderColor: '#2b821d',
            upWickColor: '#2b821d',
            downColor: '#c12e34',
            downBorderColor: '#c12e34',
            downWickColor: '#c12e34',
          },
          candle: {
            tooltip: {
              showRule: 'none',
              // offsetLeft: 14,
              // offsetTop: 16,
              // offsetRight: 14,
              // offsetBottom: 16,
            }
          },
          tooltip: {
            showRule: 'none',
            showName: false,
            showParams: false,
          }
        }
      })

      kline = init('chart', {
        layout: [
          {
            type: 'candle',
            content: ['MA', { name: 'EMA', calcParams: [10, 30] }],
            options: { order: Number.MIN_SAFE_INTEGER }
          },
          { type: 'indicator', content: ['VOL'], options: { order: 10 }  },
          { type: 'xAxis', options: { order: 9 } }
        ]
      })
      // 设置最后一根蜡烛图离图标的位置
      kline.setOffsetRightDistance(160)
      // 设置样式
      kline.setStyles('customTheme');
      // 添加别的图表
      // kline.createIndicator('customIndicatorDraw', true, { id: 'chart' })
      // 添加数据
      kline.applyNewData(this.klineHistory)
      // console.log('stylesstyles', styles)
      // console.log('myConfig', this.myConfig)

      // kline.setStyles({
      //   candle: {
      //     type: 'area',
      //   },
      // })
    },
    //监听最新值变化 注: kline值可能还没有  所以需要 kline?.
    updateNewest(newValue, oldValue, ownerInstance, instance) {
        console.log('添加数据 update', newValue)
        // 添加最新数据 
        kline?.updateData(newValue)
    },
  //监听历史数据变化  注: kline值可能还没有  所以需要 kline?.
    updateHistory(newValue, oldValue, ownerInstance, instance) {
      console.log('添加数据 add', newValue)
      // 添加历史数据 
      kline?.applyNewData(newValue)
      // ownerInstance.callMethod('setKlineHistory', newValue)
    },

    // sttringToFuncPrototype(option){
    //   for (const key in option) {
    //     let prototype = option[key]
    //     if(typeof prototype === "object") {
    //       //如果属性值是数组
    //       //遍历数组
    //       if(Array.isArray(prototype)) {
    //         prototype.forEach(item=>{
    //           if(typeof item === "object") this.sttringToFuncPrototype(item)
    //         })
    //       } else {
    //         this.sttringToFuncPrototype(prototype)
    //       }
    //     }
    //   //转换string为function
    //   if(typeof prototype === "string" && prototype.includes("function"))
    //     prototype = eval(`(${prototype})`)
    //   }
    // },
  },
  onUnmounted() {
    dispose('chart')
  }
}
 </script>

 <style lang="scss" scoped>
.app-chart {
  width: 100%;
  height: 450px;
  position: relative;
}
#init-basic-chart {
  width: 100%;
  height: 450px;
  position: relative;
}
</style>