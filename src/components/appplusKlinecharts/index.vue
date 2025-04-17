<template>
 <!-- 
  id: id值
  :newest : 最新值
  :history : 历史数据
  :change:newest : 监听最新值是否变化 (renderScript 对应下边 script 标签上的 module="renderScript")
  :change:history : 监听历史数据是否变化 (renderScript 对应下边 script 标签上的 module="renderScript")
 -->
 <view 
  id="chart"   
  :newest="klineNewest" 
  :history="klineHistory" 
  :change:newest="renderScript.updateNewest" 
  :change:history="renderScript.updateHistory">
  </view>
</template>

<script setup>
  import { onMounted,ref } from 'vue'
  import { init } from 'klinecharts' 
  // 历史
  const klineHistory = ref([])
  // 最新
  const klineNewest = ref({})
 // 获取kline 历史数据
  const getKlineHistory = ()=>{
   //http请求 略
    klineHistory .value = [
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
  }
  // 获取kline 最新数据 (webscoket)
  const webscoketKline = () => {
   //scoket请求 略
    klineNewest.value = data
  }
  onMounted(()=>{
    kline = init('chart', config)
  }) 
</script>


<!-- script  setup 不支持 lang="renderjs" 后也不支持uni-app 的各种方法(uni.xxx) -->
<script module="renderScript" lang="renderjs">
    import { config } from './klineConfig.js'
    import { init } from 'klinecharts' // 修改导入方式
    var kline
    export default {
        mounted() {
            this.initChart()
        },
        methods: {
            initChart() {
                kline = init('chart')
                kline.setStyleOptions(config)
                kline.createTechnicalIndicator('MA', false, { id: 'candle_pane'})
                kline.setStyleOptions({
                    technicalIndicator: { tooltip: { showRule: 'none'}}
                })
            },
            //监听最新值变化 注: kline值可能还没有  所以需要 kline?.
            updateNewest(newValue, oldValue, ownerInstance, instance) {
                // 添加最新数据 
                kline?.updateData(newValue)
            },
           //监听历史数据变化  注: kline值可能还没有  所以需要 kline?.
            updateHistory(newValue, oldValue, ownerInstance, instance) {
                // 添加历史数据 
                kline?.applyNewData(newValue)
            }
        }
    }
</script>



<style lang="scss" scoped>
#init-basic-chart {
  /* 确保使用flex布局 */
  flex: 1;
  /* 移除固定尺寸 */
  width: 100%;
  height: 100%;
}
</style>