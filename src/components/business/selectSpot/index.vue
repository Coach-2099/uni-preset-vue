<template>
  <div class="seleceSpot-temp">
    <div
      v-if="loadingData"
      class="myLoading pt-25 w-100 flex justify-center items-center"
    >
      <van-loading type="spinner" />
    </div>
    <template v-else>
      <div class="mt-10 ml-15 mr-15 flex justify-between">
        <div class="flex-1 flex text-gray fs-12">
          <div class="flex justify-between items-center">
            <text>交易对</text>
            <image
              class="sortImg"
              src="/static/images/sort.png" 
              mode="scaleToFill"
            />
          </div>
          <text class="divLine">/</text>
          <div class="flex justify-between items-center">
            <text>交易量</text>
            <image
              class="sortImg"
              src="/static/images/sort.png"
              mode="scaleToFill"
            />
          </div>
        </div>
        <div class="flex-1 flex justify-end text-gray fs-12">
          <div class="flex-1 flex justify-between items-center text-right mr-20 ">
            <text>Last Price</text>
            <image
              class="sortImg"
              src="/static/images/sort.png"
              mode="scaleToFill"
            />
          </div>
          <div class="flex-1 flex justify-between items-center text-right">
            <text>24H Change</text> 
            <!-- <image
              class="sortImg"
              src="/static/images/sort.png"
              mode="scaleToFill"
            /> -->
          </div>
        </div>
      </div>
      <div v-for="(item, index) in listData" :key="index">
        <div
          class="
            mt-5 ml-15 mr-15 pb-5
            ff-biance fw-b
            flex justify-between items-center"
          @click="checkBitItem(item)"
        >
          <div class="flex-1">
            <text class="fs-16">{{ item.symbol1 }}</text>
            <text class="fs-12 text-gray">/ {{ item.symbol2 }}</text>
            <div>
              <text class="fs-12 text-gray">{{ formatVolume(item.vol) + ' ' + item.symbol2 }}</text>
            </div>
          </div>
          <div class="flex-1 flex justify-end items-center">
            <div class="flex-1 text-right items-center mr-20">{{ item.close }}</div>
            <van-button class="flex-1 text-right rises_falls_btn" style="width: 22.4vw;" type="success" size="small">
              <text class="fs-14 text-white">{{ formatChange(item.rose) }}</text>
            </van-button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, watch, defineEmits } from 'vue';
import { getSymbolsLastPrice } from '@/api/quotes';
import { getTicker } from '@/api/quotes';
import { useControlStore } from '@/stores/control';

const props = defineProps({
  type: {
    type: String,
    default: 'SPOT'
  },
  searchVal: {
    type: String,
    default: ''
  }
});

const klineType = ref('');

const listData = ref<any[]>([]); // 从API获取的真实数据
const loadingData = ref(true); // 加载状态


const emit = defineEmits<{
  (e: 'closeModel', payload: {jumpType: any}): void
  // (e: 'jumpAge', payload: { type: any }): void
}>()

// stores
const controlStore = useControlStore();

watch(() => props.searchVal, (newVal, oldVal) => {
  console.log('newVal', newVal)
  console.log('oldVal', oldVal)
})

const loadData = async (kType: any) => {
  loadingData.value = true;
  klineType.value = kType
  try {
    // 使用解构赋值确保响应式更新
    listData.value = []
    const params = {
      klineType: kType,
    }
    // 添加await强制等待
    const data = await getSymbolsLastPrice(params)
    // 使用数组解构保持响应性
    listData.value = data.map((item: any) => ({
      ...item,
      symbol1: item.symbol.split('/')[0],
      symbol2: item.symbol.split('/')[1]
    }))
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    // 移除setTimeout直接更新状态
    loadingData.value = false;
  }
};

const searchFun = async () => {
  loadingData.value = true;
  try {
    // 使用解构赋值确保响应式更新
    listData.value = []
    const params = {
      klineType: props.type,
      symbol: props.searchVal
    }
    // 添加await强制等待
    const data = await getTicker(params)
    // 使用数组解构保持响应性
    listData.value = [data].map((item: any) => ({
      ...item,
      symbol1: item.symbol.split('/')[0],
      symbol2: item.symbol.split('/')[1]
    }))
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    // 移除setTimeout直接更新状态
    loadingData.value = false;
  }
}

const checkBitItem = (item: any) => {
  const activeType = controlStore.quotesData.activeType
  controlStore.setQuotesData({
    symbol: item.symbol,
    activeType: activeType || 'left',
  })
  // 选中后父组件触发加载事件
  emit('closeModel', {jumpType: klineType.value})
}

const formatVolume = (volume:any) => {
  const num = Number(volume)
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M' // 百万单位
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k' // 千单位
  }
  return num.toString() // 小于 1000 
}

const formatChange = (change:any) => {
  const num = Number(change)
  if (isNaN(num)) return '0.00%'
  
  // 添加正负号并格式化为百分比
  return `${num > 0 ? '+' : ''}${num}%`
}

defineExpose({
  loadData,
  searchFun
})

</script>

<style lang="scss" scoped>
.seleceSpot-temp {
  height: 100%;
  .sortImg {
    width: 7px;
    height: 7px;
    margin-left: 3px;
  }
  .divLine {
    margin-left: 3px;
    margin-right: 3px ;
  }
}
</style>