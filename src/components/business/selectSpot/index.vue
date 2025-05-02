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
            <text>{{ $t('noun.transactionPair') }}</text>
            <image
              class="sortImg"
              src="/static/images/sort.png" 
              mode="scaleToFill"
            />
          </div>
          <text class="divLine">/</text>
          <div class="flex justify-between items-center">
            <text>{{ $t('noun.tradingVolume') }}</text>
            <image
              class="sortImg"
              src="/static/images/sort.png"
              mode="scaleToFill"
            />
          </div>
        </div>
        <div class="flex-1 flex justify-end text-gray fs-12">
          <div class="flex-1 flex justify-end items-center text-right mr-20 ">
            <text>{{ $t('noun.lastPrice') }}</text>
            <image
              class="sortImg"
              src="/static/images/sort.png"
              mode="scaleToFill"
            />
          </div>
          <div class="flex-1 flex justify-between items-center text-right">
            <text>{{ $t('noun.hourChange') }}</text> 
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
            <van-button
              class="flex-1 text-right rises_falls_btn"
              style="width: 22.4vw;"
              :type=" item.rose > 0 ? 'success' : 'danger'"
              size="small"
            >
              <text class="fs-14 text-white">{{ formartRose(item.rose) }}</text>
            </van-button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, watch, defineEmits, computed } from 'vue';
import { getSymbolsLastPrice } from '@/api/quotes';
import { getTicker } from '@/api/quotes';
import { useControlStore } from '@/stores/control';
import { useUserStore } from '@/stores/user';
import { formartRose } from '@/utils/util'
const userStore = useUserStore();
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
const socketService = computed(() => userStore.socketService);

const emit = defineEmits<{
  (e: 'closeModel', payload: {jumpType: any}): void
}>()

// stores
const controlStore = useControlStore();

watch(() => props.searchVal, (newVal, oldVal) => {
  console.log('newVal', newVal)
  console.log('oldVal', oldVal)
})

const loadData = async (kType: any) => {
  console.log('加载数据！！！！！！！！！！！！！！！！！！！！！')
  loadingData.value = true;
  klineType.value = kType
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
  loadingData.value = false;
  isSocket()
};

const isSocket = () => {
  console.log('进行socket连接')
  // 查询数据后进行sockt 连接
  socketService.value.subscribe('ticker');
  socketService.value.on('ticker', (data: any) => {
    const index = listData.value.findIndex(item => item.symbol === data.symbol)
    if (index > -1) {
      // 使用对象展开保持响应性
      listData.value[index] = {
        ...listData.value[index],
        rose: Number((data.close-data.open)/data.open*100).toFixed(2),
        close: data.close,
        vol: data.vol,
        // rose: data.rose
      }
    }
  })
}

// 搜索方法
const searchFun = async () => {
  loadingData.value = true;
  try {
    // 清空列表前先复制原始数据
    const originalData = [...listData.value]
    listData.value = []
    // 本地筛选逻辑
    if (props.searchVal) {
      const searchKey = props.searchVal.toLowerCase()
      listData.value = originalData.filter(item => {
        return item.symbol1.toLowerCase().includes(searchKey) ||
               item.symbol2.toLowerCase().includes(searchKey)
      })
      // 移除setTimeout直接更新状态
      loadingData.value = false;
    } else {
      // 搜索词为空时恢复完整列表
      loadData(props.type)
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

const checkBitItem = (item: any) => {
  const activeType = controlStore.getQuotesData(props.type)?.activeType
  controlStore.setQuotesData(props.type,{
    symbol: item.symbol,
    activeType: activeType || 'left',
  })
  console.log('controlStore.getQuotesData(props.type) =',controlStore.getQuotesData(props.type))
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